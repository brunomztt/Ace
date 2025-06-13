import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { WeaponDto } from '../../models/Weapon';
import { SkinDto } from '../../models/Skin';
import { CommentDto } from '../../models/Comment';
import weaponApi from '../../utils/weaponApi';
import skinApi from '../../utils/skinApi';
import commentApi from '../../utils/commentApi';
import authApi from '../../utils/authApi';
import { dialogService } from '../Dialog/dialogService';
import CommentForm from '../CommentForm/CommentForm';
import './WeaponView.scss';
import CommentItem from '../CommentItem/CommentItem';

interface WeaponViewProps {
    weaponId: string;
}

const WeaponView: React.FC<WeaponViewProps> = ({ weaponId }) => {
    const navigate = useNavigate();
    const [weapon, setWeapon] = useState<WeaponDto | null>(null);
    const [skins, setSkins] = useState<SkinDto[]>([]);
    const [comments, setComments] = useState<CommentDto[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isLoadingComments, setIsLoadingComments] = useState<boolean>(false);
    const [activeSkin, setActiveSkin] = useState<number>(0);
    const [activeStat, setActiveStat] = useState<'dano' | 'especificacoes'>('dano');
    const [isModOrAdmin, setIsModOrAdmin] = useState<boolean>(false);

    useEffect(() => {
        const currentUser = authApi.getCurrentUser();
        if (!currentUser) {
            navigate('/');
            dialogService.error('Acesso restrito a usuários autenticados');
            return;
        }
        setIsModOrAdmin(currentUser?.roleName === 'Admin' || currentUser?.roleName === 'Moderator');
    }, []);

    useEffect(() => {
        const fetchWeaponData = async () => {
            if (!weaponId) return;

            try {
                setIsLoading(true);
                const weaponResponse = await weaponApi.getWeaponById(weaponId);
                const skinsResponse = await skinApi.getSkinsByWeaponId(weaponId);

                if (weaponResponse.success && weaponResponse.data) {
                    setWeapon(weaponResponse.data);

                    if (skinsResponse.success && skinsResponse.data) {
                        const defaultSkin: SkinDto = {
                            skinId: -1,
                            skinName: `${weaponResponse.data?.weaponName} Padrão`,
                            weaponId: parseInt(weaponId),
                            skinImage: weaponResponse.data?.weaponImage,
                            description: 'Skin padrão da arma, sem modificações visuais.',
                            weapon: weaponResponse.data,
                        };

                        setSkins([defaultSkin, ...skinsResponse.data]);
                    }

                    fetchComments();
                } else {
                    throw new Error(weaponResponse.message || 'Falha ao carregar dados da arma');
                }
            } catch (error: any) {
                dialogService.error(error.message || 'Erro ao carregar arma');
                navigate('/weapons');
            } finally {
                setIsLoading(false);
            }
        };

        const fetchComments = async () => {
            try {
                setIsLoadingComments(true);
                const response = await commentApi.getCommentsByEntity('Weapon', weaponId);

                if (response.success && response.data) {
                    setComments(response.data);
                }
            } catch (error: any) {
                console.error('Erro ao carregar comentários:', error);
            } finally {
                setIsLoadingComments(false);
            }
        };

        fetchWeaponData();
    }, [weaponId, navigate]);

    const formatDate = (date: Date) => {
        const d = new Date(date);
        return d.toLocaleDateString('pt-BR');
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    const handleCommentAdded = async () => {
        try {
            const response = await commentApi.getCommentsByEntity('Weapon', weaponId);
            if (response.success && response.data) {
                setComments(response.data);
            }
        } catch (error) {
            console.error('Erro ao atualizar comentários:', error);
        }
    };

    if (isLoading) {
        return (
            <div className="weapon-view-loading">
                <div className="loading-container">
                    <div className="loading-icon">
                        <span className="material-symbols-outlined">inventory_2</span>
                    </div>
                    <div className="loading-text">ACESSANDO ARMA</div>
                    <div className="loading-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
        );
    }

    if (!weapon) {
        return (
            <div className="weapon-view-error">
                <div className="error-container">
                    <div className="error-label">ARMA NÃO ENCONTRADA</div>
                    <div className="error-code">ERRO #308</div>
                    <p>A arma solicitada não existe no nosso arsenal ou foi removida.</p>
                    <button className="return-button" onClick={() => navigate('/weapons')}>
                        <span className="material-symbols-outlined">arrow_back</span>
                        VOLTAR
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="weapon-view-container">
            <div className="weapon-view-header">
                <div className="weapon-title-wrapper">
                    <h1 className="weapon-title" data-text={weapon.weaponName}>
                        {weapon.weaponName}
                    </h1>
                    <div className="weapon-title-accent"></div>
                </div>
                <div className="weapon-badge category-badge">
                    <i className="bx bx-target-lock"></i>
                    {weapon.category?.categoryName}
                </div>
                <div className="weapon-badge credit-badge">
                    <i className="bx bx-coin"></i>
                    {weapon.credits} CRÉDITOS
                </div>
            </div>

            <div className="weapon-view-content">
                <div className="weapon-profile">
                    <div className="weapon-image-container">
                        <div
                            className="weapon-image"
                            style={{
                                backgroundImage: `url(${
                                    skins.length > 0 && activeSkin < skins.length
                                        ? skins[activeSkin].skinImage || weapon.weaponImage
                                        : weapon.weaponImage
                                })`,
                            }}
                        />
                        <div className="image-frame-top"></div>
                        <div className="image-frame-bottom"></div>
                        <div className="image-corner-tl"></div>
                        <div className="image-corner-tr"></div>
                        <div className="image-corner-bl"></div>
                        <div className="image-corner-br"></div>
                        <div className="weapon-gradient-overlay"></div>
                    </div>

                    <div className="weapon-details">
                        <div className="weapon-info-header">
                            <div className="weapon-name">
                                {skins.length > 0 && activeSkin < skins.length ? skins[activeSkin].skinName : weapon.weaponName}
                            </div>
                            <div className="weapon-label">ESPECIFICAÇÃO</div>
                        </div>

                        <div className="weapon-description-container">
                            <div className="description-heading">INFORMAÇÕES DA ARMA</div>
                            <div className="description-content">
                                <p>
                                    {skins.length > 0 && activeSkin < skins.length && skins[activeSkin].description
                                        ? skins[activeSkin].description
                                        : weapon.weaponDescription || 'Informações classificadas. Acesso restrito a agentes autorizados.'}
                                </p>
                            </div>
                        </div>

                        <div className="stat-section">
                            <div className="stat-heading">ESPECIFICAÇÕES TÉCNICAS</div>
                            <div className="stat-selector">
                                <button className={`stat-btn ${activeStat === 'dano' ? 'active' : ''}`} onClick={() => setActiveStat('dano')}>
                                    Dano
                                </button>
                                <button
                                    className={`stat-btn ${activeStat === 'especificacoes' ? 'active' : ''}`}
                                    onClick={() => setActiveStat('especificacoes')}
                                >
                                    Especificações
                                </button>
                            </div>

                            {activeStat === 'dano' ? (
                                <div className="damage-table-container">
                                    <table className="damage-table">
                                        <thead>
                                            <tr>
                                                <th>Parte do Corpo</th>
                                                <th>Curta Distância</th>
                                                <th>Longa Distância</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="head-row">
                                                <td>Cabeça</td>
                                                <td>{weapon.damageHeadClose || '-'}</td>
                                                <td>{weapon.damageHeadFar || '-'}</td>
                                            </tr>
                                            <tr className="body-row">
                                                <td>Corpo</td>
                                                <td>{weapon.damageBodyClose || '-'}</td>
                                                <td>{weapon.damageBodyFar || '-'}</td>
                                            </tr>
                                            <tr className="leg-row">
                                                <td>Pernas</td>
                                                <td>{weapon.damageLegClose || '-'}</td>
                                                <td>{weapon.damageLegFar || '-'}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="specs-container">
                                    <div className="specs-grid">
                                        <div className="spec-item">
                                            <div className="spec-label">Modo de Tiro</div>
                                            <div className="spec-value">{weapon.fireMode || 'N/A'}</div>
                                        </div>
                                        <div className="spec-item">
                                            <div className="spec-label">Cadência de Tiro</div>
                                            <div className="spec-value">{weapon.fireRate ? `${weapon.fireRate} tiros/s` : 'N/A'}</div>
                                        </div>
                                        <div className="spec-item">
                                            <div className="spec-label">Penetração de Parede</div>
                                            <div className="spec-value">{weapon.wallPenetration || 'N/A'}</div>
                                        </div>
                                        <div className="spec-item">
                                            <div className="spec-label">Velocidade de Corrida</div>
                                            <div className="spec-value">{weapon.runSpeed ? `${weapon.runSpeed} m/s` : 'N/A'}</div>
                                        </div>
                                        <div className="spec-item">
                                            <div className="spec-label">Velocidade de Equipar</div>
                                            <div className="spec-value">{weapon.equipSpeed ? `${weapon.equipSpeed} s` : 'N/A'}</div>
                                        </div>
                                        <div className="spec-item">
                                            <div className="spec-label">Velocidade de Recarga</div>
                                            <div className="spec-value">{weapon.reloadSpeed ? `${weapon.reloadSpeed} s` : 'N/A'}</div>
                                        </div>
                                        <div className="spec-item">
                                            <div className="spec-label">Tamanho do Carregador</div>
                                            <div className="spec-value">{weapon.magazineSize || 'N/A'}</div>
                                        </div>
                                        <div className="spec-item">
                                            <div className="spec-label">Munição de Reserva</div>
                                            <div className="spec-value">{weapon.reserveAmmo || 'N/A'}</div>
                                        </div>
                                        <div className="spec-item">
                                            <div className="spec-label">Dispersão do Primeiro Tiro</div>
                                            <div className="spec-value">{weapon.firstShotSpread ? `${weapon.firstShotSpread}°` : 'N/A'}</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {skins.length > 0 && (
                    <div className="weapon-skins-section">
                        <h2>SKINS DISPONÍVEIS</h2>
                        <div className="skins-gallery">
                            {skins.map((skin, index) => (
                                <div
                                    key={skin.skinId}
                                    className={`skin-item ${activeSkin === index ? 'active' : ''}`}
                                    onClick={() => setActiveSkin(index)}
                                >
                                    <div className="skin-image" style={{ backgroundImage: `url(${skin.skinImage || weapon.weaponImage})` }}></div>
                                    <div className="skin-name">{skin.skinName}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="weapon-comments-section">
                    <h2>DICAS VERIFICADAS</h2>

                    <CommentForm entityType="Weapon" entityId={parseInt(weaponId)} onCommentAdded={handleCommentAdded} />

                    {isLoadingComments ? (
                        <div className="comments-loading">
                            <div className="loading-icon">
                                <span className="material-symbols-outlined">comment</span>
                            </div>
                            <div className="loading-text">Carregando dicas...</div>
                        </div>
                    ) : (
                        <div className="comments-list">
                            {comments.length === 0 ? (
                                <div className="no-comments">
                                    <span className="material-symbols-outlined">info</span>
                                    <p>Nenhuma dica disponível para esta arma.</p>
                                    <div className="hint">{'Seja o primeiro a adicionar uma dica!'}</div>
                                </div>
                            ) : (
                                comments.map((comment) => (
                                    <CommentItem key={comment.commentId} comment={comment} onCommentUpdated={handleCommentAdded} />
                                ))
                            )}
                        </div>
                    )}
                </div>

                <div className="weapon-category-info">
                    <h3>SOBRE {weapon.category?.categoryName}</h3>
                    <p>{getCategoryDescription(weapon.category?.categoryName || '')}</p>
                </div>
            </div>
        </div>
    );
};

const getCategoryDescription = (categoryName: string): string => {
    switch (categoryName) {
        case 'Rifle':
            return 'Rifles são armas de médio a longo alcance com alto poder de fogo e precisão. São ideais para combates à distância e oferecem excelente controle em rajadas de tiro.';
        case 'Pistola':
            return 'Pistolas são armas secundárias com baixo custo, oferecendo uma opção econômica para rodadas iniciais ou de economia. Eficazes a curtas distâncias quando utilizadas com precisão.';
        case 'Submetralhadora':
            return 'Submetralhadoras oferecem alta cadência de tiro e mobilidade, sendo eficazes em curtas e médias distâncias. Perfeitas para rodadas de economia e para estilos de jogo agressivos.';
        case 'Escopeta':
            return 'Escopetas têm alto dano a curta distância, sendo ideais para defender espaços fechados ou emboscadas. Dominam combates corpo a corpo, mas perdem eficácia rapidamente com a distância.';
        case 'Sniper':
            return 'Rifles de precisão oferecem alto dano a longas distâncias, perfeitos para eliminar inimigos com um único tiro. Requerem alta precisão e posicionamento estratégico.';
        case 'Metralhadora':
            return 'Armas pesadas possuem grande poder de fogo e munição, mas reduzem sua mobilidade ao usá-las. Excelentes para controlar áreas e negar acesso a corredores.';
        case 'Faca':
            return 'Armas corpo a corpo que estão sempre disponíveis, independente de sua compra de equipamento. Letais com golpes pelas costas, oferecem movimentação silenciosa.';
        default:
            return 'Informações indisponíveis para esta categoria de armamento.';
    }
};

export default WeaponView;
