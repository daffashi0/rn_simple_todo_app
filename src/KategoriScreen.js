import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  Button,
  Alert,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import IconIonicons from 'react-native-vector-icons/Ionicons';

const Kategori = (props) => {
  const [nama, setNama] = useState('');
  const [data, setData] = useState();
  const [todo, setTodo] = useState();
  const base_url = 'http://10.0.2.2:8000/';
  const {navigation} = props;

  useEffect(() => getKategori(), []);

  //Delete Todo
  useEffect(() => {
    if (todo) {
      for (let i = 0; i < todo.length; i++) {
        deleteTodo(todo[i].id);
      }
    }
  }, [todo]);

  //Get Kategori
  const getKategori = () => {
    axios.get(base_url + 'kategori').then((resp) => {
      console.log(resp);
      setData(resp.data);
    });
  };

  //Add Kategori
  const handlePress = () => {
    if (!nama) {
      Alert.alert('Nama kategori tidak boleh kosong');
    } else {
      axios
        .post(base_url + 'kategori', {
          nama: nama,
        })
        .then((resp) => {
          setNama('');
          getKategori();
          console.log(resp);
        })
        .catch((err) => console.error(err));
    }
  };

  //Delete Kategori
  const handleDelete = (id) => {
    Alert.alert(
      'Hapus Kategori',
      'Apakah anda ingin menghapus kategori?',
      [
        {
          text: 'Tidak',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Ya',
          onPress: () => {
            deleteKategori(id);
            getTodo(id);
          },
        },
      ],
      {cancelable: false},
    );
  };

  const deleteKategori = (id) => {
    axios
      .delete(base_url + 'kategori/' + id)
      .then((resp) => {
        getKategori();
        console.log(resp);
      })
      .catch((err) => console.error(err));
  };

  const getTodo = (id_kat) => {
    axios
      .get(base_url + 'todo?id_kategori=' + id_kat)
      .then((resp) => {
        console.log('getTodo ', resp.data);
        setTodo(resp.data);
      })
      .catch((err) => console.log(err));
  };

  const deleteTodo = (id) => {
    axios.delete(base_url + 'todo/' + id).then((resp) => {
      console.log('getTodo ', resp);
      setTodo(resp.data);
    });
  };

  //Pindah screen
  const onPressKategori = (id_kat) => {
    axios.get(base_url + 'todo?id_kategori=' + id_kat).then((resp) => {
      console.log('getTodo ', resp);
      navigation.navigate('Todo', {
        data: resp.data,
        id_kategori: id_kat,
      });
    });
  };

  //Item render
  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.containerCard}
      onPress={() => onPressKategori(item.id)}>
      <Text style={[styles.textCard, {flex: 1}]}>{item.nama}</Text>
      <TouchableOpacity
        style={styles.containerDelete}
        onPress={() => handleDelete(item.id)}>
        <IconIonicons name={'trash-outline'} color="#a31d02" size={20} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.textInput}>
        <TextInput
          placeholder="Nama kategori"
          onChangeText={(value) => setNama(value)}
          value={nama}
        />
      </View>
      <Button title="Add Kategori" color="#b39ddb" onPress={handlePress} />
      <Text style={styles.textJudul}>List Kategori</Text>
      {data && (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
};

export default Kategori;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 30,
    paddingVertical: 10,
  },
  containerCard: {
    flexDirection: 'row',
    backgroundColor: '#b39ddb',
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: 'center',
    elevation: 3,
    marginBottom: 10,
  },
  textJudul: {
    color: '#000000',
    marginTop: 15,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  textCard: {
    color: '#000000',
    fontSize: 16,
  },
  textInput: {
    borderColor: '#000000',
    borderWidth: 2,
    marginVertical: 15,
    paddingHorizontal: 10,
  },
  containerDelete: {
    flex: 0.1,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    height: 30,
  },
});
