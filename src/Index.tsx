/*
 * Copyright (c) 2017 David Sehnal, licensed under Apache 2.0, See LICENSE file for more info.
 */

namespace ChannelsDB {

    export function renderUI(target: HTMLElement, kind: 'Search' | 'About') {
        if (kind === 'Search') {
            ReactDOM.render(<SearchMain state={initState()} />, target);
        } else {
            ReactDOM.render(<AboutMain />, target);
        }
    }

    type GlobalProps = { state: State };

    class SearchMain extends React.Component<GlobalProps, {}> {
        render() {
            return <div className='container'>
                <Menu />
                <Intro />
                <SearchView {...this.props} />
                <Footer />
            </div>;
        }
    }

    class AboutMain extends React.Component<{}, {}> {
        render() {
            return <div className='container'>
                <Menu />
                <About />
                <Footer />
            </div>;
        }
    }

    class Footer extends React.Component<{}, {}> {
        render() {
            return <footer>
                <hr className='featurette-divider' />
                <p className='pull-right' style={{ color: '#999', fontSize: 'smaller', marginBottom: '30px' }}>&copy; 2017 Lukáš Pravda &amp; David Sehnal</p>
            </footer>;
        }
    }

    class SearchView extends React.Component<GlobalProps, {}> {

        render() {
            return <div style={{ marginTop: '35px' }}>
                <div className='row'>
                    <div className='col-lg-12'><SearchBox {...this.props} /></div>
                </div>
                <div className='row'>
                    <div className='col-lg-12'><StateView {...this.props} /></div>
                </div>
            </div>;
        }
    }

    class StateView extends React.Component<GlobalProps, {}> {

        componentDidMount() {
            this.props.state.stateUpdated.subscribe(() => this.forceUpdate());
        }

        render() {
            const state = this.props.state.viewState;
            try {
                switch (state.kind) {
                    case 'Info': return <Info />;
                    case 'Loading': return <div>{state.message}</div>;
                    case 'Searched': return <SearchResults {...this.props} />;
                    case 'Entries': return <Entries {...this.props} mode='Full' value={state.term} />;
                    case 'Error': return <div>Error: {state.message}</div>;
                    default: return <div>Should not happen ;)</div>;
                }
            } catch (e) {
                return <div>Error: {'' + e}</div>;
            }
        }
    }

    class SearchBox extends React.Component<GlobalProps, {}> {
        render() {
            return <div className='form-group form-group-lg'>
                <input type='text' className='form-control' style={{ fontWeight: 'bold' }} placeholder='Search (e.g., cytochrome p450) ...'
                    onChange={(e) => this.props.state.searchTerm.onNext(e.target.value)}
                    onKeyPress={(e) => {
                        if (e.key !== 'Enter') return;
                        this.props.state.fullSearch.onNext(void 0);
                        updateViewState(this.props.state, { kind: 'Entries', term: (e.target as any).value });
                    }} />
            </div>;
        }
    }

    class SearchResults extends React.Component<GlobalProps, {}> {
        private empty() {
            return <div>No results</div>;
        }

        private groups() {
            const data = (this.props.state.viewState as ViewState.Seached).data;
            const groups = data.grouped.category.groups;
            return groups.map((g: any, i: number) => <SearchGroup key={g.groupValue + '--' + i} {...this.props} group={g} />);
        }

        render() {
            try {
                const data = (this.props.state.viewState as ViewState.Seached).data;
                if (!data.grouped.category.groups.length) return this.empty();
                return <div>
                    <div style={{ padding: '0 0 15px 0', marginTop: '-15px', fontStyle: 'italic', textAlign: 'right' }}><small>Press 'Enter' for full-text search.</small></div>
                    <div>{this.groups()}</div>
                </div>;
            } catch (e) {
                return this.empty();
            }
        }
    }

    class SearchGroup extends React.Component<GlobalProps & { group: any }, { isExpanded: boolean, docs: any[], isLoading: boolean, entries?: { group: string, value: string, var_name: string, count: number } }> {
        state = { isExpanded: false, docs: [] as any[], isLoading: false, entries: void 0 as any as { group: string, value: string, var_name: string, count: number } };

        private toggle = (e: React.MouseEvent<any>) => {
            e.preventDefault();
            this.setState({ isExpanded: !this.state.isExpanded });
        }

        private showEntries = (e: React.MouseEvent<HTMLAnchorElement>) => {
            e.preventDefault();
            const value = (e.target as HTMLAnchorElement).getAttribute('data-value')!;
            const var_name = (e.target as HTMLAnchorElement).getAttribute('data-var')!;
            const count = +(e.target as HTMLAnchorElement).getAttribute('data-count')!;
            this.setState({ entries: { group: this.props.group.groupValue, value, var_name, count } });
        }

        private loadMore = async () => {
            try {
                this.setState({ isLoading: true });
                const docs = await searchPdbCategory(this.props.state.searchedTerm, this.state.docs[0].var_name, this.state.docs.length);
                console.log(docs);
                this.setState({ isLoading: false, docs: this.state.docs.concat(docs) });
            } catch (e) {
                this.setState({ isLoading: false });
            }
        }

        componentDidMount() {
            this.setState({ docs: this.props.group.doclist.docs });
        }

        private entry(d: any, i: any) {
            return <div key={d.value + d.var_name + '--' + i}>
                <a href='#' data-value={d.value} data-var={d.var_name} data-count={d.num_pdb_entries} onClick={this.showEntries} title={`${d.value}`}>{d.value}</a> 
                <div className='count'>{d.num_pdb_entries}</div>
            </div>;
        }

        render() {
            const g = this.props.group;

            return <div style={{ marginBottom: '10px' }}>
                <div className='group-header'><button className='btn btn-default btn-block' onClick={this.toggle}><span className={`glyphicon glyphicon-${this.state.isExpanded ? 'minus' : 'plus'}`} aria-hidden='true'></span> <span>{g.groupValue}</span> ({g.doclist.numFound})</button></div>
                <div className='group-list-wrap' style={{ display: this.state.entries ? 'none' : 'block' }}>
                    <div className='group-list' style={{ display: this.state.isExpanded ? 'block' : 'none' }}>
                        {this.state.docs.map((d: any, i: number) => this.entry(d, i)) }
                        {this.state.docs.length < g.doclist.numFound
                            ? <div style={{ padding: 0, float: 'none', clear: 'both' }}>
                                <button style={{ width: '100%', display: 'block' }} className='btn btn-xs btn-primary btn-block' disabled={this.state.isLoading ? true : false} onClick={this.loadMore}>{this.state.isLoading ? 'Loading...' : `More (${g.doclist.numFound - this.state.docs.length} remaining)`}</button>
                            </div>
                            : void 0}
                    </div>
                    <div style={{ clear: 'both' }} />                    
                </div>
                { this.state.entries && this.state.isExpanded
                ? <div className='entry-list-wrap'>
                    <button className='btn btn-block btn-primary' onClick={() => this.setState({ entries: void 0 })}><span className={`glyphicon glyphicon-chevron-left`} aria-hidden='true'></span></button>
                    <Entries state={this.props.state} {...this.state.entries!} mode='Embed' />
                  </div>
                : void 0 }
            </div>;
        }
    }

    class Entries extends React.Component<GlobalProps & { group?: string, value: string, var_name?: string, count?: number, mode: 'Embed' | 'Full'  }, { isLoading: boolean, entries: any[], count: number }> {
        state = { isLoading: false, entries: [] as any[], count: -1 };

        private fetchEmbed = async () => {
            try {
                this.setState({ isLoading: true });
                const data = await fetchPdbEntries(this.props.var_name!, this.props.value, this.state.entries.length, 6);
                this.setState({ isLoading: false, entries: this.state.entries.concat(data), count: this.props.count! });
            } catch (e) {
                this.setState({ isLoading: false });
            }
        }

        private fetchFull = async () => {
            try {
                this.setState({ isLoading: true });
                const { groups, matches } = await fetchPdbText(this.props.value, this.state.entries.length, 12);
                this.setState({ isLoading: false, entries: this.state.entries.concat(groups), count: matches });
            } catch (e) {
                this.setState({ isLoading: false });
            }
        }

        private fetch = this.props.mode === 'Embed' ? this.fetchEmbed : this.fetchFull;

        componentDidMount() {
            this.fetch();
        }

        private entry(e: any, i: number) {
            const docs = e.doclist.docs[0];
            return <div key={docs.pdb_id + '--' + i} className='well pdb-entry'>             
                <a href={`http://channelsdb.dominiktousek.eu/ChannelsDB/detail/${docs.pdb_id}`} >
                    <div className='pdb-entry-header'>  
                        <div>{docs.pdb_id}</div>
                        <div title={docs.title || 'n/a'}>{docs.title || 'n/a'}</div>                    
                    </div>
                </a>
                <ul>
                    <li><b>Experiment Method:</b> {(docs.experimental_method || ['n/a']).join(', ')} | {docs.resolution || 'n/a'} Å</li>
                    <li><b>Organism:</b> <i>{(docs.organism_scientific_name || ['n/a']).join(', ')}</i></li>
                </ul>
                <div className='pdb-entry-img-wrap'>
                    <img src={`https://webchem.ncbr.muni.cz/API/ChannelsDB/Download/${docs.pdb_id.toLowerCase()}?type=figure`}/>
                </div>
            </div>;
        }

        render() {
            const groups = this.state.entries;

            return <div>
                {this.props.mode === 'Embed'
                    ? <h4><b>{this.props.group}</b>: {this.props.value} <small>({this.props.count})</small></h4>
                    : <h4><b>Search</b>: {this.props.value} <small>({this.state.count >= 0 ? this.state.count : '?'})</small></h4>
                }
                <div style={{ marginTop: '15px', position: 'relative' }}>
                    {groups.map((g: any, i: number) => this.entry(g, i))}
                    <div style={{ clear: 'both' }} />
                    {this.state.count < 0 || this.state.entries.length < this.state.count
                        ? <button className='btn btn-sm btn-primary btn-block' disabled={this.state.isLoading ? true : false} onClick={this.fetch}>{this.state.isLoading ? 'Loading...' : `Show more (${this.state.count > 0 ? this.state.count - this.state.entries.length : '?'} remaining)`}</button>
                        : void 0}
                </div>
            </div>;
        }
    }
}