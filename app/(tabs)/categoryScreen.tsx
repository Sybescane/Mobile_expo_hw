import React, { useState } from 'react';
import {
    View,
    Text,
    Button,
    TextInput,
    StyleSheet,
    Alert,
    ScrollView,
} from 'react-native';
import { IconButton, Menu } from 'react-native-paper';
import categoryStore from '../CategoryStore';
import { useRouter } from 'expo-router';
import { observer } from 'mobx-react-lite';

const CategoryScreen = observer(() => {
    const router = useRouter();
    const [visibleMenu, setVisibleMenu] = useState<string | null>(null);

    const toggleMenu = (id: string) => {
        setVisibleMenu(visibleMenu === id ? null : id);
    };

    const handleDeleteCategory = (id: string) => {
        categoryStore.removeCategory(id);
        Alert.alert('Удалено', 'Категория успешно удалена');
    };

    const handleEditCategory = (id: string) => {
        router.push({ pathname: '/updatecategory', params: { id } });
    };

    const handleCreateCategory = () => {
        router.push('/addcategory');
    };

    return (
        <View style={styles.container}>
            <Button title="Создать категорию" onPress={handleCreateCategory} />

            <ScrollView>
                {categoryStore.categories.map((category) => (
                    <View key={category.id} style={styles.categoryRow}>
                        <Text style={styles.categoryText}>{`Название: ${category.name}`}</Text>
                        <Menu
                            visible={visibleMenu === category.id}
                            onDismiss={() => setVisibleMenu(null)}
                            anchor={
                                <IconButton
                                    icon="dots-vertical"
                                    size={24}
                                    onPress={() => toggleMenu(category.id)}
                                />
                            }
                        >
                            <Menu.Item
                                onPress={() => {
                                    handleEditCategory(category.id);
                                    toggleMenu(category.id);
                                }}
                                title="Редактировать"
                            />
                            <Menu.Item
                                onPress={() => {
                                    handleDeleteCategory(category.id);
                                    toggleMenu(category.id);
                                }}
                                title="Удалить"
                            />
                        </Menu>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    categoryRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderColor: '#ccc',
        paddingVertical: 8,
    },
    categoryText: {
        flex: 1,
        marginRight: 16,
    },
});

export default CategoryScreen;