/*
 * Copyright (c) 2017 David Sehnal, licensed under Apache 2.0, See LICENSE file for more info.
 */

namespace ChannelsDB {
    export function renderUI(target: HTMLElement, kind: 'Search' | 'Methods' | 'Documentation' | 'Contribute' | 'About' | 'GDPR') {
        switch (kind) {
            case 'Search':
                ReactDOM.render(<SearchMain state={initState()} />, target);
                break;
            case 'Methods':
                ReactDOM.render(<MethodsMain />, target);
                break;
            case 'Documentation':
                ReactDOM.render(<DocumentationMain />, target);
                break;
            case 'Contribute':
                ReactDOM.render(<ContributeMain />, target);
                break;
            case 'About':
                ReactDOM.render(<AboutMain />, target);
                break;
            case 'GDPR':
                ReactDOM.render(<GDPRMain />, target);
                break;

        }
    }

    type GlobalProps = { state: State };

    class SearchMain extends React.Component<GlobalProps, {}> {
        render() {
            return <div className='container'>
                <Menu />
                <div className='container-fluid' style={{ padding: '0 15px '}}>
                    <SearchView {...this.props} />
                </div>
                <Footer />
            </div>;
        }
    }

    class MethodsMain extends React.Component<{}, {}> {
        render() {
            return <div className='container'>
                <Menu />
                <Methods />
                <Footer />
            </div>;
        }
    }

    class DocumentationMain extends React.Component<{}, {}> {
        render() {
            return <div className='container'>
                <Menu />
                <Documentation />
                <Footer />
            </div>;
        }
    }

    class ContributeMain extends React.Component<{}, {}> {
        render() {
            return <div className='container'>
                <Menu />
                <Contribute />
                <Footer />
            </div>;
        }
    }

    class GDPRMain extends React.Component<{}, {}> {
        render() {
            return <div className='container'>
                <Menu />
                <GDPR />
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
                <p className='pull-right' style={{ color: '#999', fontSize: 'smaller', marginBottom: '30px' }}>&copy; 2018 Lukáš Pravda &amp; David Sehnal;  2023 Anna Špačková & Václav Bazgier | <a href="gdpr.html">Terms of Use &amp; GDPR </a></p>
            </footer>;
        }
    }

    class SearchView extends React.Component<GlobalProps, {}> {

        render() {
            return <div style={{ marginTop: '20px' }}>
                <div className='row'>
                    <div className='col-lg-12'><SearchBox {...this.props} /></div>
                </div>
                <div className='row'>
                    <div className='col-lg-12'><AlphaFillSearchBox {...this.props} /></div>
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
                    case 'Info': return <Info state={this.props.state} />;
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

    class SearchBox extends React.Component<GlobalProps, { isAvailable: boolean }> {
        state = { isAvailable: false };

        componentDidMount() {
            this.props.state.dbContentAvailable.subscribe((isAvailable) => this.setState({ isAvailable }));
        }

        render() {
            return <div className='form-group form-group-lg'>
                <img className="img" src="assets/img/pdbe_logo.png" alt="pdbe_logo" height="30" />
                {this.state.isAvailable
                    ? <input key={'fullsearch'} type='text' className='form-control' style={{ fontWeight: 'bold', borderColor: 'darkgreen' }} placeholder='Search ChannelsDB (e.g., cytochrome p450, 5ebl, KcsA) ...'
                        onChange={(e) => this.props.state.searchTerm.onNext(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key !== 'Enter') return;
                            this.props.state.fullSearch.onNext(void 0);
                            updateViewState(this.props.state, { kind: 'Entries', term: (e.target as any).value });
                        }} />
                    : <input key={'placeholder'} type='text' className='form-control' style={{ fontWeight: 'bold', textAlign: 'left', borderColor: 'darkgreen' }} disabled={true}
                        value='Initializing search...'  />}
            </div>;
        }
    }

    class AlphaFillSearchBox extends React.Component<GlobalProps, { isAvailable: boolean }> {
        //TODO initialize with search of AlphaFill molecules
        state = { isAvailable: false };

        componentDidMount() {
            this.props.state.dbContentAvailable.subscribe((isAvailable) => this.setState({ isAvailable }));
        }

        render() {
            return <div className='form-group form-group-lg'>
                <img className="img" src="assets/img/alphafill-logo.png" alt="alphafill_logo" height="50" />
                {this.state.isAvailable
                    ? <input key={'fullsearch'} type='text' className='form-control' style={{ fontWeight: 'bold', borderColor: 'darkgreen' }} placeholder='Search ChannelsDB for AlphaFill tunnels (P08686)....'
                        //onChange={(e) => this.props.state.searchTerm.onNext(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key !== 'Enter') {
                                return;
                            };
                            console.log((e.target as any).value);
                            //TODO check if UNIPROT exists
                            window.open(`/detail/alphafill/${(e.target as any).value}`, "_blank");
                            // this.props.state.fullSearch.onNext(void 0);
                            // updateViewState(this.props.state, { kind: 'Entries', term: (e.target as any).value });
                        }} />
                    : <input key={'placeholder'} type='text' className='form-control' style={{ fontWeight: 'bold', textAlign: 'left', borderColor: 'darkgreen' }} disabled={true}
                        value='Initializing search...'  />}
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

    class Entry extends React.Component<GlobalProps & { docs: any }, { }> {
        render() {
            const docs = this.props.docs;
            const pdbContentMap = new Array('CSATunnels MOLE', 'CSATunnels Caver', 'ReviewedChannels MOLE', 'ReviewedChannels Caver',
             'CofactorTunnels MOLE', 'CofactorTunnels Caver', 'TransmembranePores MOLE', 'TransmembranePores Caver', 'ProcognateTunnels MOLE',
             'ProcagnateTunnels Caver');
            const alphafillContentMap = new Array('AlphaFillTunnels MOLE', 'AlphaFillTunnels Caver');
            const pdb = this.props.state.dbContent.pdb[toLower(docs.pdb_id)];
            const alphafill = this.props.state.dbContent.alphafill[toLower(docs.pdb_id)];
            const numPdbChannels = pdb ? (pdb as number[]).reduce((a, b) => a + b, 0) : -1;
            const numAlphafillChannels = alphafill ? (alphafill as number[]).reduce((a, b) => a + b, 0) : -1;
            let pdbContent = numPdbChannels > 0 ? (pdb as number[]).map((el, index) => el > 0 ? pdbContentMap[index] + ' (' + el + ')' : '') : new Array();
            let alphafillContent = numAlphafillChannels > 0 ? (pdb as number[]).map((el, index) => el > 0 ? alphafillContentMap[index] + ' (' + el + ')' : '') : new Array();
            const msgPdb = numPdbChannels > 0 ? pdbContent.filter((a) => a.length > 0).reduce((a, b) => a + ', ' + b) : '';
            const msgAlphafill = numAlphafillChannels > 0 ? alphafillContent.filter((a) => a.length > 0).reduce((a, b) => a + ', ' + b) : '';

            return <div className='well pdb-entry'>
                <a href={`/detail/pdb/${docs.pdb_id}`} target='_blank'>
                    <div className='pdb-entry-header' style={{ background: pdb ? '#dfd' : '#ddd' }}>
                        <div>{docs.pdb_id}</div>
                        <div title={docs.title || 'n/a'}>{docs.title || 'n/a'}</div>
                    </div>
                </a>
                <ul>
                    <li><b>Experiment Method:</b> {(docs.experimental_method || ['n/a']).join(', ')} | {docs.resolution || 'n/a'} Å</li>
                    <li><b>Organism:</b> <i>{(docs.organism_scientific_name || ['n/a']).join(', ')}</i></li>
                    { numPdbChannels > 0
                        ? <li><i>{`${numPdbChannels} channel${numPdbChannels !== 1 ? 's' : ''}; ${msgPdb}`}</i></li>
                        : 
                      numAlphafillChannels > 0
                        ? <li><i>{`${numAlphafillChannels} channel${numAlphafillChannels !== 1 ? 's' : ''}; ${msgAlphafill}`}</i></li> : void 0
                    }
                </ul>
                <div className='pdb-entry-img-wrap'>
                    <img src={`https://webchem.ncbr.muni.cz/API/ChannelsDB/Download/${docs.pdb_id.toLowerCase()}?type=png`}/>
                </div>
            </div>;
        }
    }

    class Entries extends React.Component<GlobalProps & { group?: string, value: string, var_name?: string, count?: number, mode: 'Embed' | 'Full'  }, { isLoading: boolean, entries: any[], count: number, withCount: number, withoutCount: number, showing: number }> {
        state = { isLoading: false, entries: [] as any[], count: -1, showing: 0, withCount: -1, withoutCount: -1 };

        private fetchEmbed = async () => {
            try {
                this.setState({ isLoading: true });
                const { entries, withCount, withoutCount } = await fetchPdbEntries(this.props.state, this.props.var_name!, this.props.value);
                this.setState({ isLoading: false, entries, count: withCount + withoutCount, withCount, withoutCount, showing: this.growFactor });
            } catch (e) {
                this.setState({ isLoading: false });
            }
        }

        private fetchFull = async () => {
            try {
                this.setState({ isLoading: true });
                const { entries, withCount, withoutCount } = await fetchPdbText(this.props.state, this.props.value);
                this.setState({ isLoading: false, entries, count: withCount + withoutCount, withCount, withoutCount, showing: this.growFactor });
            } catch (e) {
                this.setState({ isLoading: false });
            }
        }

        private loadMore = () => this.setState({ showing: this.state.showing + this.growFactor });

        private growFactor = this.props.mode === 'Embed' ? 6 : 12;
        private fetch = this.props.mode === 'Embed' ? this.fetchEmbed : this.fetchFull;

        componentDidMount() {
            this.fetch();
        }

        render() {
            const groups = this.state.entries;

            const entries = [];
            for (let i = 0, _b = Math.min(this.state.showing, this.state.entries.length); i < _b; i++) {
                entries.push(<Entry key={i} state={this.props.state} docs={groups[i].doclist.docs[0]} />);
            }

            return <div>
                {this.props.mode === 'Embed'
                    ? <h4><b>{this.props.group}</b>: {this.props.value} <small>({this.state.withCount === 0 ? `No systems with channels!` : `${this.state.count}; ${this.state.withCount} with channels`})</small></h4>
                    : <h4><b>Search</b>: {this.props.value} <small>({this.state.count >= 0 ? `${this.state.count}; ${this.state.withCount} with channels` : '?'})</small></h4>
                }
                {
                    this.state.isLoading ? <div>Loading...</div> : void 0
                }
                <div style={{ marginTop: '15px', position: 'relative' }}>
                    {entries}
                    <div style={{ clear: 'both' }} />
                    {this.state.showing < this.state.count
                        ? <button className='btn btn-sm btn-primary btn-block' disabled={this.state.isLoading ? true : false} onClick={this.loadMore}>{this.state.isLoading ? 'Loading...' : `Show more (${this.state.count > 0 ? this.state.count - this.state.showing : '?'} remaining; ${Math.max(this.state.withCount - this.state.showing, 0)} with channels)`}</button>
                        : void 0}
                </div>
            </div>;
        }
    }
}