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
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import IconIonicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';

const Todo = (props) => {
  const [text, setText] = useState('');
  const [item, setItem] = useState();
  const {navigation} = props;
  const [data, setData] = useState(navigation.getParam('data'));
  const id_kat = navigation.getParam('id_kategori');
  const base_url = 'http://10.0.2.2:8000/';

  //Render ulang jika ada perubahan data
  useEffect(() => {
    if (data) {
      setItem(data);
    }
  }, [data]);

  //Get Todo
  const getTodo = () => {
    axios
      .get(
        base_url + 'todo?id_kategori=' + id_kat + '&_sort=is_done&_order=asc',
      )
      .then((resp) => {
        setData(resp.data);
        console.log(resp);
      })
      .catch((err) => console.error(err));
  };

  //Handle Icon Done
  const handleDone = (item) => {
    axios
      .put(base_url + 'todo/' + item.id, {
        ...item,
        is_done: !item.is_done,
      })
      .then((resp) => {
        getTodo();
        console.log(resp);
      });
  };

  //Delete Todo
  const handleDelete = (id) => {
    Alert.alert(
      'Hapus Item',
      'Apakah anda ingin menghapus item?',
      [
        {
          text: 'Tidak',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Ya',
          onPress: () => {
            deleteTodo(id);
          },
        },
      ],
      {cancelable: false},
    );
  };

  const deleteTodo = (id) => {
    axios.delete(base_url + 'todo/' + id).then((resp) => {
      console.log('response delete ', resp);
      getTodo();
    });
  };

  //Add Todo
  const handleAddTodo = () => {
    if (!text) {
      Alert.alert('Input tidak boleh kosong');
    } else {
      addTodo();
    }
  };

  const addTodo = () => {
    axios
      .post(base_url + 'todo', {
        id_kategori: id_kat,
        isi: text,
        is_done: false,
      })
      .then((resp) => {
        getTodo();
        console.log(resp);
      })
      .catch((err) => console.error(err));

    setText('');
  };

  //Card Todo
  const renderItem = ({item}) => (
    <TouchableOpacity style={styles.containerCard}>
      <View
        style={{
          backgroundColor: item.is_done ? '#02a30f' : '#a31d02',
          width: 10,
          height: '50%',
          borderRadius: 5,
          marginRight: 5,
        }}
      />
      <Text style={[styles.textCard, {flex: 1}]}>{item.isi}</Text>
      <TouchableOpacity
        style={styles.containerDelete}
        onPress={() => handleDelete(item.id)}>
        <IconIonicons name={'trash-outline'} color="#a31d02" size={20} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.containerDone}
        onPress={() => handleDone(item)}>
        <IconAntDesign
          name={item.is_done ? 'checkcircle' : 'checkcircleo'}
          color="#02a30f"
          size={20}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.textInput}>
        <TextInput
          placeholder="Task"
          onChangeText={(value) => setText(value)}
          value={text}
        />
      </View>
      <Button title="Add Task" color="#b39ddb" onPress={handleAddTodo} />
      <Text style={styles.textJudul}>List Kategori</Text>
      {data && <FlatList data={data} renderItem={renderItem} />}
    </View>
  );
};
export default Todo;

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
    marginRight: 5,
  },
  containerDone: {
    flex: 0.1,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    height: 30,
  },
});
