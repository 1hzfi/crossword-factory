import React, { useEffect, useState } from 'react'
import useGlobalState from '../utils/useGlobalState'
import { Link } from "react-router-dom";
import LazyImage from "./LazyImage";

function OwnGrids() {
    const globalState = useGlobalState();
    const [list, setList] = useState('');
    const { username, api_token } = globalState.user;
    const [keyWords, setKeyWords] = useState(['']);
  
    useMemo(()=>{
        const loadGrids = async () => {
            const queryParam = keyWords.length ? 
                `?q=${encodeURIComponent(keyWords.join(" ").toUpperCase().toLowerCase())}` :
                '';
            const r = await fetch(
                `${import.meta.env.VITE_API_URL}/user/${username}/${queryParam}`,
                {
                    method: 'GET',
                    credentials: 'omit',
                    headers: {
                        'Authorization': 'Token ' + api_token,
                        'Content-Type': 'application/json'
                    }
                }
            );
            const list = await r.json()
            setList(list.crosswords_grids);
            return;
        }
        return  (async () => (await loadGrids()))();
    }, [keyWords, api_token, username])

    return (
        <div className="container main-container">
            <div className="row">
                <div className="mb-3">
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        const qs = document.getElementById("searchInput").value.toUpperCase().toLowerCase().replaceAll(/[^a-z\s]/gi, '');
                        console.log(qs);
                        setKeyWords(qs);
                        return;
                    }}>
                        <label className="form-label" />
                        <input id="searchInput" class="form-control" placeholder="Mots Clefs"/>
                        <button type="submit" className="btn btn-primary">Lancer la recherche</button>
                    </form>
                </div>
                { !!list.length ? (list.map(((e,idx)=>(
                <div key={e.id} className="col-12 col-sm-6 col-md-3">
                    <div className="card mb-3">
                        <div className="card-body">
                            <LazyImage src={
                                import.meta.env.VITE_API_URL +
                                "/grid/" +
                                e.id +
                                "/preview?auth_token=" + api_token
                                } class="card-img-top" alt="Aperçu grille"/>
                            <h3 style={{width: '100%'}}>{e.published ? <Link className="stretched-link" to={"/grille/"+e.id}>{e.title}</Link> : e.title}</h3>
                            <div style={{ zIndex: 11, position: 'relative', textAlign: 'right' }}><Link to={"/grille/"+e.id+'/modifier'}><button type="button" className="float-right btn btn-primary">Modifier</button></Link></div>
                            <span>{e.width}x{e.height} {e.published && <span className="badge bg-danger">publié</span>}</span><br/>
                            <span>Créée {(new Date(e.creation_date)).toLocaleDateString("fr-FR")}</span><br/>
                            <span>Modifiée {(new Date(e.modification_date)).toLocaleDateString("fr-FR")}</span>
                        </div>
                    </div>
                </div>
                )))):
                <h2>Pas de grilles</h2>
                }
            </div>
        </div>
    )
}

export default OwnGrids