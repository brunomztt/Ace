import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import weaponApi from '../../utils/weaponApi';
import { WeaponDto, WeaponCategoryDto } from '../../models/Weapon';
import './WeaponListing.scss';
import authApi from '../../utils/authApi';
import { dialogService } from '../Dialog/dialogService';

const WeaponListing: React.FC = () => {
    const [weapons, setWeapons] = useState<WeaponDto[]>([]);
    const [categories, setCategories] = useState<WeaponCategoryDto[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    useEffect(() => {
        const currentUser = authApi.getCurrentUser();
        if (!currentUser) {
            navigate('/');
            dialogService.error('Acesso restrito a usuários autenticados');
        }
    }, [navigate]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const weaponsResponse = await weaponApi.getAllWeapons();
                const categoriesResponse = await weaponApi.getAllWeaponCategories();

                if (weaponsResponse.success) {
                    setWeapons(weaponsResponse.data || []);
                }

                if (categoriesResponse.success) {
                    setCategories(categoriesResponse.data || []);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const filteredWeapons = weapons.filter((weapon) => {
        const matchesSearch = weapon.weaponName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === null || weapon.categoryId === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handleWeaponClick = (weaponId: number) => {
        navigate(`/weapon/${weaponId}`);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleCategoryClick = (categoryId: number | null) => {
        setSelectedCategory(categoryId);
    };

    return (
        <div className="weaponListingContainer">
            <div className="searchContainer">
                <input type="text" className="searchInput" placeholder="Buscar arma..." value={searchTerm} onChange={handleSearchChange} />
            </div>
            <h1 className="pageTitle">ARSENAL</h1>

            <div className="categoriesContainer">
                <button className={`categoryButton ${selectedCategory === null ? 'active' : ''}`} onClick={() => handleCategoryClick(null)}>
                    Todos
                </button>
                {categories.map((category) => (
                    <button
                        key={category.categoryId}
                        className={`categoryButton ${selectedCategory === category.categoryId ? 'active' : ''}`}
                        onClick={() => handleCategoryClick(category.categoryId)}
                    >
                        {category.categoryName}
                    </button>
                ))}
            </div>

            <div className="weaponsGridContainer">
                {isLoading ? (
                    <div className="loadingMessage">Carregando armas</div>
                ) : filteredWeapons.length === 0 ? (
                    <div className="noWeaponsMessage">Nenhuma arma encontrada</div>
                ) : (
                    <div className="weaponsGrid">
                        {filteredWeapons.map((weapon) => (
                            <div key={weapon.weaponId} className="weaponCard" onClick={() => handleWeaponClick(weapon.weaponId)}>
                                <div className="weaponImageContainer">
                                    <img src={weapon.weaponImage} alt={weapon.weaponName} className="weaponImage" loading="lazy" />
                                </div>
                                <div className="weaponNameContainer">
                                    <h3 className="weaponName">{weapon.weaponName}</h3>
                                    <div className="weaponCategory">{weapon.category?.categoryName}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default WeaponListing;
