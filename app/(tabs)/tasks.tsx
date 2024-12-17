import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { observer } from 'mobx-react-lite';
import eventStore from '../EventStore';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import Dropdown from 'react-native-input-select';
import { Menu, IconButton } from 'react-native-paper';
import categoryStore from '../CategoryStore';
import { addDays, startOfMonth, startOfWeek } from 'date-fns';

const TasksScreen = observer(() => {
    const router = useRouter();
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedDateFilter, setSelectedDateFilter] = useState<string>('All');
    const [menuVisible, setMenuVisible] = useState<Record<string, boolean>>({});

    const now = new Date();
    
      const startOfDay = new Date(now.setHours(0, 0, 0, 0));
      const startOfWeekDate = startOfWeek(now, { weekStartsOn: 1 });
      const startOfMonthDate = startOfMonth(now);
    
    const filteredEvents = eventStore.events
        .filter((event) => {
            console.log(event);
            if (selectedCategory && event.categoryId !== selectedCategory || !event.canChecked) return false;

            const eventDate = new Date(event.date); // Преобразуем строку даты в объект Date

            // Фильтр по дате
            if (selectedDateFilter === 'day') {
                return (
                    eventDate >= startOfDay &&
                    eventDate < addDays(startOfDay, 1)
                );
            }
            if (selectedDateFilter === 'week') {
                return (
                    eventDate >= startOfWeekDate &&
                    eventDate < addDays(startOfWeekDate, 7)
                );
            }
            if (selectedDateFilter === 'month') {
                return (
                    eventDate >= startOfMonthDate &&
                    eventDate < addDays(startOfMonthDate, 30)
                );
            }
            return true; // Если фильтр пустой, отображаем все события
        });

    const handleDeleteEvent = (eventId: string) => {
        Alert.alert(
            'Удалить событие?',
            'Вы уверены, что хотите удалить это событие?',
            [
                {
                    text: 'Отмена',
                    style: 'cancel',
                },
                {
                    text: 'Удалить',
                    onPress: () => eventStore.removeEvent(eventId),
                },
            ]
        );
    };

    const handleUpdateEvent = (eventId: string) => {
        router.push({ pathname: '/update', params: { id: eventId } });
    };

    const toggleMenu = (eventId: string) => {
        setMenuVisible((prev) => ({
            ...prev,
            [eventId]: !prev[eventId],
        }));
    };

    return (
        <View style={styles.container}>

            <Dropdown
                label="Категория"
                placeholder="Выберите категорию..."
                options={categoryStore.categories.map((category) => ({ label: category.name, value: category.id }))}
                selectedValue={selectedCategory}
                onValueChange={(value) => setSelectedCategory(value as string)}
                primaryColor={'green'}
            />
            <Dropdown
                    placeholder="Выберите диапазон..."
                    options={[
                    { label: 'На день', value: 'day' },
                    { label: 'На неделю', value: 'week' },
                    { label: 'На месяц', value: 'month' },
                    { label: 'Все', value: 'All' },
                    ]}
                    selectedValue={selectedDateFilter}
                    onValueChange={(value) => setSelectedDateFilter(value as string)}
                    primaryColor={'green'}
                />
            <IconButton
                icon="plus"
                size={24}
                onPress={() => router.push('/add')}
                style={styles.addButton}
            />

            <ScrollView>
                {filteredEvents.map((event) => (
                    <View key={event.id} style={styles.eventRow}>
                        <Text style={styles.eventText}>
                            {`Название: ${event.title}, Дата: ${event.date}, Категория: ${categoryStore.categories.find(x => x.id === event.categoryId)?.name || 'Нет категории'}`}
                        </Text>

                        <Menu
                            visible={menuVisible[event.id]}
                            onDismiss={() => toggleMenu(event.id)}
                            anchor={
                                <IconButton
                                    icon="dots-vertical"
                                    size={24}
                                    onPress={() => toggleMenu(event.id)}
                                />
                            }
                        >
                            {event.canChecked && (
                                <Menu.Item
                                    onPress={() => {
                                        eventStore.toggleEventCompletion(event.id);
                                        toggleMenu(event.id);
                                    }}
                                    title={event.isCompleted ? 'Сделать не выполненным' : 'Сделать выполненным'}
                                />
                            )}
                            <Menu.Item
                                onPress={() => {
                                    handleUpdateEvent(event.id); // Переход на экран редактирования
                                    toggleMenu(event.id);
                                }}
                                title="Редактировать"
                            />
                            <Menu.Item
                                onPress={() => {
                                    handleDeleteEvent(event.id);
                                    toggleMenu(event.id);
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
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    addButton: {
        alignSelf: 'flex-end',
        marginBottom: 16,
    },
    eventRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderColor: '#ccc',
        paddingVertical: 8,
    },
    eventText: {
        flex: 1,
        marginRight: 16,
    },
});

export default TasksScreen;
