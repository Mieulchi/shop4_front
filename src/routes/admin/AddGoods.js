import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './admincss/AddGoods.module.css';
import { Toast, ToastContainer } from 'react-bootstrap';
import { createGoods } from '../../services/GoodsService';

function AddGoods() {
  const imageUrl = process.env.PUBLIC_URL;

  let [name, setName] = useState('');
  let [price, setPrice] = useState('');
  let [description, setDescription] = useState('');
  let [stock, setStock] = useState('');
  let [url, setUrl] = useState('');
  let [category, setCategory] = useState('');
  const [files, setFiles] = useState([]);

  //일단 여기부터 uploadFiles는 없는셈 치세요
  const handleFilesChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const uploadFiles = (e) => {
    if (!files) {
      return;
    }
    e.preventDefault();
    const formData = new FormData();
    files.map((file) => {
      formData.append('files', file);
    });

    axios
      .post(`${imageUrl}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  let [toast, setToast] = useState(false);
  let navigate = useNavigate();

  async function validateAndSubmit() {
    if (
      name === '' ||
      price === '' ||
      stock === '' ||
      description === '' ||
      category === ''
    ) {
      setToast(true);
    } else {
      let newItem = {
        name: name,
        price: price,
        stock: stock,
        description: description,
        category: category,
        url: 'tmp',
      };
      // Submit newItem to the backend or handle it as needed << Who wrote this beautiful English ?
      await createGoods(newItem);
      navigate('/');
    }
  }

  return (
    <div className={styles.addGoodsContainer}>
      <br />
      <br />
      <h2 className={styles.header}>상품 추가 페이지</h2>
      <table className={styles.table}>
        <tbody>
          <tr>
            <td>상품명</td>
            <td>
              <input type="text" onChange={(e) => setName(e.target.value)} />
            </td>
          </tr>
          <tr>
            <td>가격</td>
            <td>
              <input type="text" onChange={(e) => setPrice(e.target.value)} />
            </td>
          </tr>
          <tr>
            <td>상품 설명</td>
            <td>
              <input
                type="text"
                onChange={(e) => setDescription(e.target.value)}
              />
            </td>
          </tr>
          <tr>
            <td>재고수</td>
            <td>
              <input type="text" onChange={(e) => setStock(e.target.value)} />
            </td>
          </tr>
          <tr>
            <td>상품 이미지</td>
            <td>
              <input
                type="file"
                className={styles.fileInput}
                onChange={(e) => {
                  handleFilesChange(e);
                  if (e.target.files[0]) {
                    setUrl(`${imageUrl}/${e.target.files[0].name}`);
                  }
                }}
              />
            </td>
          </tr>
          <tr>
            <td>카테고리</td>
            <td>
              <select onChange={(e) => setCategory(e.target.value)}>
                <option value={'shoes'}>신발</option>
                <option value={'top'}>상의</option>
                <option value={'bottom'}>하의</option>
                <option value={'hat'}>모자</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
      <div className={styles.buttonContainer}>
        <button
          className={styles.addButton}
          onClick={(e) => {
            validateAndSubmit();
          }}
        >
          등록하다
        </button>
        <button className={styles.cancelButton} onClick={() => navigate('/')}>
          돌아가다
        </button>
      </div>
      <ToastContainer className={styles.toastContainer} position="bottom-end">
        <Toast
          bg="danger"
          onClose={() => setToast(false)}
          show={toast}
          delay={3000}
          autohide
        >
          <Toast.Header>
            <strong className="me-auto">경고</strong>
          </Toast.Header>
          <Toast.Body className={styles.toastBody}>
            모든 필드를 입력해주세요.
          </Toast.Body>
        </Toast>
      </ToastContainer>
      {url && <img src={url} alt="Preview" className={styles.imgPreview} />}
    </div>
  );
}

export default AddGoods;
