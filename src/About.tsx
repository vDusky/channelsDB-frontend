/*
 * Copyright (c) 2017 David Sehnal, licensed under Apache 2.0, See LICENSE file for more info.
 */

namespace ChannelsDB {
    export class About extends React.Component<{}, {}> {
        render() {
            return <div className='container'>
                <h1 className='text-center'>References</h1>
                <div className='tab-pane'>
                    <p>If you find this resource usefull, please cite is as:</p>
                    <dl className='publications-list'>
                        <dt>ChannelsDB</dt>
                        <dd>
                            <p>Pravda,L., Sehnal,D., Svobodová Vařeková,R., Navrátilová,V., Toušek,D., Berka,K., Otyepka,M. and Koča,J. &nbsp;
                                <a href='http://dx.doi.org/10.1093/nar/gkx868' target='_blank'>ChannelsDB: database of biomacromolecular tunnels and pores.</a>
                                 Nucleic Acids Res., 10.1093/nar/gkx868.</p>
                        </dd>
                    </dl>
                </div>
                    
                <div className='tab-pane'>
                    <p>Data annotations are taken from scientific literature, which is properly linked with a given PDB entry. Other than that the ChannelsDB uses the following services: </p>
                    <dl className='publications-list'>
                        <dt>MOLE</dt>
                        <dd>
                            <p>Sehnal,D., Svobodová Vařeková,R., Berka,K., Pravda,L., Navrátilová,V., Banáš,P., Ionescu,C.-M., Otyepka,M. and Koča,J. (2013) &nbsp;
                                 <a href='https://dx.doi.org/10.1186/1758-2946-5-39' target='_blank'>MOLE 2.0: advanced approach for analysis of biomacromolecular channels</a>. J. Cheminform., 5, 39.</p>
                        </dd>
                        <dt>CAVER</dt>
                        <dd>
                            <p>Chovancova E, Pavelka A, Benes P, Strnad O, Brezovsky J, Kozlikova B, Gora A, Sustr V, Klvana M, Medek P, Biedermannova L, Sochor J, Damborsky J. &nbsp;
                            <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3475669/" target="_blank">CAVER 3.0: a tool for the analysis of transport pathways in dynamic protein structures</a>
                            . PLoS Comput Biol. 2012;8(10):e1002708. doi: 10.1371/journal.pcbi.1002708.</p>
                        </dd>
                        <dt>LiteMol suite</dt>
                        <dd>
                            <p>Sehnal,D., Deshpande,M., Vařeková,R.S., Mir,S., Berka,K., Midlik,A., Pravda,L., Velankar,S. and Koča,J. (2017) &nbsp;
                                 <a href='http://dx.doi.org/10.1038/nmeth.4499'>LiteMol suite: interactive web-based visualization of large-scale macromolecular structure data</a>. Nat. Methods, 14, 1121–1122.</p>
                        </dd>
                        <dt>UniProt API</dt>
                        <dd>
                            <p>Nightingale,A., Antunes,R., Alpi,E., Bursteinas,B., Gonzales,L., Liu,W., Luo,J., Qi,G., Turner,E. and Martin,M. (2017) &nbsp;
                                 <a href='https://dx.doi.org/10.1093/nar/gkx237' target='_blank'>The Proteins API: accessing key integrated protein and genome information</a>.
                                    Nucleic Acids Res., 45, W539–W544.</p>
                        </dd>
                        <dt>Protein Data Bank in Europe</dt>
                        <dd>
                            <p>Velankar,S., van Ginkel,G., Alhroub,Y., Battle,G.M., Berrisford,J.M., Conroy,M.J., Dana,J.M., Gore,S.P., Gutmanas,A., Haslam,P., et al. (2016) &nbsp;
                                 <a href='https://dx.doi.org/10.1093/nar/gkv1047' target='_blank'>PDBe: improved accessibility of macromolecular structure data from PDB and EMDB</a>.
                                    Nucleic Acids Res., 44, D385–D395.</p>
                        </dd>
                        <dt>SIFTS</dt>
                        <dd>
                            <p>Velankar,S., Dana,J.M., Jacobsen,J., van Ginkel,G., Gane,P.J., Luo,J., Oldfield,T.J., O’Donovan,C., Martin,M.-J. and Kleywegt,G.J. (2013) &nbsp;
                                 <a href='https://dx.doi.org/10.1093/nar/gks1258' target='_blank'>SIFTS: Structure Integration with Function, Taxonomy and Sequences resource</a>.
                            Nucleic Acids Res., 41, D483–D489.</p>
                        </dd>
                    </dl>
                </div>
            </div>;
        }
    }
}