import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { WeaponDto } from '../../models/Weapon';
import { SkinDto } from '../../models/Skin';
import weaponApi from '../../utils/weaponApi';
import skinApi from '../../utils/skinApi';
import { dialogService } from '../Dialog/dialogService';
import './WeaponView.scss';

interface WeaponViewProps {
    weaponId: string;
}

const WeaponView: React.FC<WeaponViewProps> = ({ weaponId }) => {
    const navigate = useNavigate();
    const [weapon, setWeapon] = useState<WeaponDto | null>(null);
    const [skins, setSkins] = useState<SkinDto[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [activeTab, setActiveTab] = useState<'estatisticas' | 'skins'>('estatisticas');
    const [activeSkin, setActiveSkin] = useState<number>(0);

    useEffect(() => {
        const carregarDados = async () => {
            if (!weaponId) return;

            try {
                setIsLoading(true);
                const respostaArma = await weaponApi.getWeaponById(weaponId);
                const respostaSkins = await skinApi.getSkinsByWeaponId(weaponId);

                if (respostaArma.success && respostaArma.data) {
                    setWeapon(respostaArma.data);
                } else {
                    throw new Error(respostaArma.message || 'Erro ao carregar arma');
                }

                if (respostaSkins.success && respostaSkins.data) {
                    setSkins(respostaSkins.data);
                }
            } catch (error: any) {
                dialogService.error(error.message || 'Erro ao carregar dados');
                navigate('/armas');
            } finally {
                setIsLoading(false);
            }
        };

        carregarDados();
    }, [weaponId, navigate]);

    if (isLoading) {
        return (
            <div className="weapon-view-loading">
                <div className="loading-animation">
                    <span className="material-symbols-outlined">cached</span>
                </div>
                <p>Carregando dados da arma...</p>
            </div>
        );
    }

    if (!weapon) {
        return (
            <div className="weapon-view-error">
                <span className="material-symbols-outlined">error</span>
                <p>Arma não encontrada</p>
                <button className="btn-voltar" onClick={() => navigate('/armas')}>
                    <span className="material-symbols-outlined">arrow_back</span>
                    Voltar para armas
                </button>
            </div>
        );
    }

    const renderizarDano = () => (
        <div className="tabela-dano">
            <h3>Dano por Distância</h3>
            <table>
                <thead>
                    <tr>
                        <th>Parte do Corpo</th>
                        <th>Curta Distância</th>
                        <th>Longa Distância</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Cabeça</td>
                        <td>{weapon.damageHeadClose}</td>
                        <td>{weapon.damageHeadFar}</td>
                    </tr>
                    <tr>
                        <td>Corpo</td>
                        <td>{weapon.damageBodyClose}</td>
                        <td>{weapon.damageBodyFar}</td>
                    </tr>
                    <tr>
                        <td>Pernas</td>
                        <td>{weapon.damageLegClose}</td>
                        <td>{weapon.damageLegFar}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );

    const renderizarEstatisticas = () => (
        <div className="estatisticas-container">
            <div className="cards-estatisticas">
                <div className="card-estatistica">
                    <div className="icone">
                        <span className="material-symbols-outlined">paid</span>
                    </div>
                    <h4>Economia</h4>
                    <ul>
                        <li>Categoria: {weapon.category?.categoryName}</li>
                        <li>Custo: {weapon.credits} Créditos</li>
                    </ul>
                </div>

                <div className="card-estatistica">
                    <div className="icone">
                        <span className="material-symbols-outlined">speed</span>
                    </div>
                    <h4>Desempenho</h4>
                    <ul>
                        <li>Modo de Disparo: {weapon.fireMode}</li>
                        <li>Cadência: {weapon.fireRate}/s</li>
                        <li>Penetração: {weapon.wallPenetration}</li>
                    </ul>
                </div>

                <div className="card-estatistica">
                    <div className="icone">
                        <span className="material-symbols-outlined">magazine</span>
                    </div>
                    <h4>Munição</h4>
                    <ul>
                        <li>Carregador: {weapon.magazineSize}</li>
                        <li>Reserva: {weapon.reserveAmmo}</li>
                        <li>Recarga: {weapon.reloadSpeed}s</li>
                    </ul>
                </div>

                <div className="card-estatistica">
                    <div className="icone">
                        <span className="material-symbols-outlined">directions_run</span>
                    </div>
                    <h4>Movimento</h4>
                    <ul>
                        <li>Velocidade: {weapon.runSpeed}m/s</li>
                        <li>Equipar: {weapon.equipSpeed}s</li>
                    </ul>
                </div>
            </div>

            {renderizarDano()}
        </div>
    );

    const renderizarSkins = () => (
        <div className="skins-container">
            {skins.length === 0 ? (
                <div className="sem-skins">
                    <span className="material-symbols-outlined">palette</span>
                    <p>Nenhuma skin disponível</p>
                </div>
            ) : (
                <>
                    <div className="skin-destaque">
                        <img src={skins[activeSkin].skinImage} alt={skins[activeSkin].skinName} className="skin-imagem" />
                        <div className="skin-info">
                            <h3>{skins[activeSkin].skinName}</h3>
                            <p>{skins[activeSkin].description}</p>
                            <span className={`raridade ${skins[activeSkin].rarity.toLowerCase()}`}>{skins[activeSkin].rarity}</span>
                        </div>
                    </div>

                    <div className="skin-galeria">
                        {skins.map((skin, index) => (
                            <div
                                key={skin.skinId}
                                className={`skin-miniatura ${index === activeSkin ? 'ativa' : ''}`}
                                onClick={() => setActiveSkin(index)}
                            >
                                <img src={skin.skinImage} alt={skin.skinName} />
                                <div className="overlay">
                                    <span>{skin.skinName}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );

    return (
        <div className="weapon-view-container">
            <div className="weapon-hero">
                <div className="weapon-info">
                    <h1>{weapon.weaponName}</h1>
                    <div className="detalhes-cabecalho">
                        <span className="categoria">{weapon.category?.categoryName}</span>
                        <div className="preco">
                            <span className="material-symbols-outlined">paid</span>
                            {weapon.credits}
                        </div>
                    </div>
                    <p className="descricao">{weapon.weaponDescription}</p>
                </div>

                <div className="weapon-imagem-container">
                    <img src={weapon.weaponImage} alt={weapon.weaponName} className="weapon-imagem" />
                </div>
            </div>

            <div className="estatisticas-rapidas">
                <div className="estatistica">
                    <span className="material-symbols-outlined">speed</span>
                    <div className="valor">{weapon.fireRate}</div>
                    <div className="rotulo">Cadência</div>
                </div>
                <div className="estatistica">
                    <span className="material-symbols-outlined">magazine</span>
                    <div className="valor">{weapon.magazineSize}</div>
                    <div className="rotulo">Carregador</div>
                </div>
                <div className="estatistica">
                    <span className="material-symbols-outlined">shield</span>
                    <div className="valor">{weapon.wallPenetration}</div>
                    <div className="rotulo">Penetração</div>
                </div>
                <div className="estatistica">
                    <span className="material-symbols-outlined">timer</span>
                    <div className="valor">{weapon.reloadSpeed}s</div>
                    <div className="rotulo">Recarga</div>
                </div>
            </div>

            <div className="abas-navegacao">
                <button className={`aba ${activeTab === 'estatisticas' ? 'ativa' : ''}`} onClick={() => setActiveTab('estatisticas')}>
                    <span className="material-symbols-outlined">analytics</span>
                    Estatísticas
                </button>
                <button className={`aba ${activeTab === 'skins' ? 'ativa' : ''}`} onClick={() => setActiveTab('skins')}>
                    <span className="material-symbols-outlined">palette</span>
                    Skins
                </button>
            </div>

            <div className="conteudo-aba">{activeTab === 'estatisticas' ? renderizarEstatisticas() : renderizarSkins()}</div>
        </div>
    );
};

export default WeaponView;
