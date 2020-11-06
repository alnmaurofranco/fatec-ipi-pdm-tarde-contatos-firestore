import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import * as firebase from 'firebase';
import ENV from './env';
import 'firebase/firestore';

if (!firebase.apps.length) return firebase.initializeApp(ENV);

//database
const db = firebase.firestore();

export default function App() {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [contatos, setContatos] = useState([]);

  const capturarNome = (nome) => {
    setNome(nome);
  };
  const capturarTelefone = (telefone) => {
    setTelefone(telefone);
  };

  const adicionarContato = () => {
    db.collection('contatos').add({
      nome: nome,
      telefone: telefone,
      data: new Date()
    })
  }

  const removerContato = (chave) => {
    Alert.alert(
      'Apagar?',
      'Quer mesmo apagar esse Contato ?',
      [
        { text: 'Cancelar' },
        { text: 'Confirmar', onPress: () => db.collection('contatos').doc(chave).delete() }
      ]
    )
  }

  useEffect(() => {
    db.collection('contatos').onSnapshot(snap => {
      let aux = [];

      snap.forEach(doc => {
        aux.push({
          nome: doc.data().nome,
          telefone: doc.data().telefone,
          data: doc.data().data,
          chave: doc.id
        })
      });

      setContatos(aux);
    })
  }, []);

  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.inputText}
        placeholder="Digite seu nome..."
        value={nome}
        onChangeText={capturarNome}
      />
      <TextInput
        style={styles.inputText}
        placeholder="Digite seu telefone..."
        value={telefone}
        onChangeText={capturarTelefone}
      />
      <View styles={styles.btn}>
        <Button
          title="Adicionar"
          onPress={adicionarContato}
        />
      </View>

      <Text style={estilos.titulo}>Lista de Contatos</Text>

      <FlatList
        style={styles.container}
        data={contatos}
        renderItem={contato => {
          <TouchableOpacity onLongPress={() => removerContato(contato.item.chave)}>
            <View style={styles.itemNaLista}>
              <Text>Nome: {contato.item.nome}</Text>
              <Text>Telefone: {contato.item.telefone}</Text>
              <Text>Data: {contato.item.data.toDate().toLocaleString()}</Text>
            </View>
          </TouchableOpacity>
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
    alignItems: "center",
    justifyContent: "center",
  },
  entrada: {
    padding: 8,
    borderBottomColor: '#DDD',
    borderBottomWidth: 1,
    fontSize: 14,
    textAlign: 'center',
    width: '80%',
    marginBottom: 12
  },
  titulo: {
    fontSize: 50,
    marginTop: 150,
  },
  btn: {
    marginTop: 11,
  },
  itemNaLista: {
    marginBottom: 4,
    borderBottomColor: '#DDD',
    borderBottomWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12
  },
  inputContainer: {
    display: "flex",
    justifyContent: "center",
    marginTop: "5rem",
  },
  inputText: {
    padding: 10,
    margin: 5,
    width: 550,
    borderBottomColor: "black",
    borderBottomWidth: 1,
  }
});
