import { View, Text, Button, TextInput, StyleSheet, Alert, Switch } from 'react-native';
import eventStore from './EventStore';
import { Event } from './Event';
import React from 'react';
import { toJS } from 'mobx';
import { useRouter } from 'expo-router';
import categoryStore from './CategoryStore';

const AddEventScreen = () => {
  const router = useRouter();

  const [event, setEvent] = React.useState<Omit<Event, 'id' | 'isCompleted'>>({
    title: '',
    date: '',
    categoryId: '',
    canChecked: false,
  });

  const handleSaveEvent = async () => {
    if (!event.title || !event.date) {
      Alert.alert('Ошибка', 'Заполните все поля перед сохранением');
      return;
    }
    const newEvent: Event = {
      ...event,
      id: Date.now().toString(), // Генерация уникального id
      isCompleted: false,       // Устанавливаем статус события
    };

    await eventStore.addEvent(newEvent);
    console.log(toJS(eventStore.events));
    Alert.alert('Успех', 'Событие успешно добавлено');
    setEvent({ title: '', date: '', categoryId: '', canChecked: false });
    router.push('/'); 
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Название события"
        value={event.title}
        onChangeText={(text) => setEvent({ ...event, title: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Дата события (например, 2024-12-31)"
        value={event.date}
        onChangeText={(text) => setEvent({ ...event, date: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Категория (например, Работа)"
        value={event.categoryId}
        onChangeText={(text) =>
          setEvent({
            ...event,
            categoryId: categoryStore.categories.find(x => x.name === text)?.name,
          })
        }
      />

      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Может быть выполнено:</Text>
        <Switch
          value={event.canChecked}
          onValueChange={(value) => setEvent({ ...event, canChecked: value })}
        />
      </View>

      <Button title="Сохранить событие" onPress={handleSaveEvent} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  switchLabel: {
    flex: 1,
    fontSize: 16,
  },
});

export default AddEventScreen;
