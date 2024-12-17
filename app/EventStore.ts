import { makeAutoObservable } from "mobx";
import { Event } from "./Event";
import axios from "axios";



class EventStore {
  events: Event[] = [];

  constructor() {
    makeAutoObservable(this);

    this.events = [{
      id: "1",
      title: "Event 1",
      date: "2021-04-01",
      categoryId: "1",
      isCompleted: false,
      canChecked: true
    },
    {
      id: "2",
      title: "Event 2",
      date: "2021-02-05",
      categoryId: "2",
      isCompleted: false,
      canChecked: false
    },
    {
      id: "3",
      title: "Event 3",
      date: "2021-02-01",
      categoryId: "3",
      isCompleted: false,
      canChecked: true
    }]
  }

  async addEvent(event: Event) {
    const res = (await axios.post("http://10.0.2.2:4000/Task/Create", { event })).data;
    const newevent: Event = { id: res.id, title: event.title, date: event.date, categoryId: event.categoryId, isCompleted: false, canChecked: true };
    this.events.push(newevent);
  }

  async removeEvent(id: string) {
    await axios.delete(`http://10.0.2.2:4000/Task/Delete?id=${id}`);
    this.events = this.events.filter((event) => event.id !== id);
  }

  async updateEvent(updatedEvent: Event) {
    const res = await axios.put("http://10.0.2.2:4000/Task/Update", updatedEvent);
    const index = this.events.findIndex((event) => event.id === updatedEvent.id);
    if (index !== -1) {
      this.events[index] = updatedEvent;
    }
  }

  toggleEventCompletion(id: string) {
    const event = this.events.find((e) => e.id === id);
    if (event) {
      event.isCompleted = !event.isCompleted;
    }
  }

  filterByType(category: string) {
    return this.events.filter((event) => event.categoryId === category);
  }

  get eventsByDay() {
    const today = new Date().toISOString().split("T")[0];
    return this.events.filter((event) => event.date.startsWith(today));
  }

  get eventsByWeek() {
    const today = new Date();
    const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    const lastDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6));
    return this.events.filter((event) => {
      const eventDate = new Date(event.date);
      return eventDate >= firstDayOfWeek && eventDate <= lastDayOfWeek;
    });
  }

  get eventsByMonth() {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    return this.events.filter((event) => {
      const eventDate = new Date(event.date);
      return eventDate >= startOfMonth && eventDate <= endOfMonth;
    });
  }
}

const eventStore = new EventStore();
export default eventStore;
