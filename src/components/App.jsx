import React, { Component } from 'react';
import Notiflix from 'notiflix';
import shortid from 'shortid';
import ContactList from './ContactList';
import ContactForm from './ContactForm';
import css from './Contacts.module.css';
import Filter from './Filter';

class App extends Component {
  state = {
    contacts: [
      // { id: 'id-1', name: 'Rosie Simpson', number: '459-12-56' },
      // { id: 'id-2', name: 'Hermione Kline', number: '443-89-12' },
      // { id: 'id-3', name: 'Eden Clements', number: '645-17-79' },
      // { id: 'id-4', name: 'Annie Copeland', number: '227-91-26' },
    ],
    filter: '',
  };

  componentDidMount() {
    const contacts = localStorage.getItem('contacts')
    const parseContacts = JSON.parse(contacts)
    if(parseContacts) {
      this.setState({contacts: parseContacts})
    }
    
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.contacts !== this.prevState) {
      localStorage.setItem('contacts', JSON.stringify(this.state.contacts));
    }
  }

  deleteContact = contactId => {
    this.setState(prevState => ({
      contacts: prevState.contacts.filter(contact => contact.id !== contactId),
    }));
  };

  addContact = (name, number) => {
    const hasName = this.state.contacts.some(
      obj => obj.name.toLowerCase() === name.toLowerCase()
    );
    console.log(hasName);
    console.log(name, number);

    if (hasName) {
      Notiflix.Notify.info(`${name} is alredy in contacts`);
      return;
    } else {
      const contact = {
        id: shortid.generate(),
        name,
        number,
      };
      this.setState(({ contacts }) => ({
        contacts: [contact, ...contacts],
      }));
    }
  };

  changeFilter = e => {
    this.setState({ filter: e.currentTarget.value });
  };

  getVisibleContacts = () => {
    const { filter, contacts } = this.state;
    const normalizedFilter = filter.toLowerCase();

    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(normalizedFilter)
    );
  };

  render() {
    const { filter } = this.state;

    const visibleContacts = this.getVisibleContacts();

    return (
      <div className={css.section}>
        <h1>Phonebook</h1>

        <ContactForm onSubmit={this.addContact} />
        <h1>Contacts</h1>
        <Filter value={filter} onChange={this.changeFilter} />

        <ContactList
          contacts={visibleContacts}
          onDeleteContact={this.deleteContact}
        />
      </div>
    );
  }
}

export default App;
