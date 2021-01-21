import axios from 'axios';

const base_url = 'http://10.0.2.2:8000/';

export function getKategori() {
  axios.get(base_url + 'kategori').then((resp) => {
    console.log(resp);
    return resp.data;
  });
}

export function getTodo(id) {
  axios.get(base_url + 'todo?id_kategori=' + id).then((resp) => {
    console.log(resp);
    return resp.data;
  });
}
