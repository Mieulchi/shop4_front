import { Toast, ToastContainer } from 'react-bootstrap';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import styles from './admincss/UpdateUser.module.css';
import { getMember, getProfileImage } from '../../services/MemberService';

function UpdateMember() {
	const location = useLocation();
	let id = location.state;
	let [user, setUser] = useState([]);
	let [image, setImage] = useState();

	let [name, setName] = useState('');
	let [price, setPrice] = useState('');
	let [description, setDescription] = useState('');
	let [stock, setStock] = useState('');
	let [url, setUrl] = useState('');
	let [category, setCategory] = useState('');

	let [toast, setToast] = useState(false);
	let navigate = useNavigate();

	useEffect(() => {
		const setMember = async () => {
			await getMember(id).then((response) => {
				setUser(response.data);
				console.log(user);
			});
		};
		setMember().then(async () => {
			const response = await getProfileImage(id, { responseType: 'blob' });

			if (response.status === 200) {
				const blob = response.data; // 바이너리 데이터(Blob)를 받아옴

				const imageUrl = URL.createObjectURL(blob); // Blob 데이터를 URL로 변환
				console.log(imageUrl);
				setImage(imageUrl);
			}
		});
	}, [id]);

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
				url: url,
			};

			console.log(newItem);

			navigate(-1);
		}
	}

	return (
		<div className={styles.updateMemberContainer}>
			<br />
			<br />
			<h2 className={styles.header}>멤버 관리 페이지</h2>
			<div style={{ display: 'flex' }}>
				<div
					style={{
						width: '300px',
						height: '300px',
						borderRadius: '70%',
						overflow: 'hidden',
					}}
				>
					<img className={styles.member_image} src={image}></img>
				</div>
				<table className={styles.table}>
					<tbody>
						<tr>
							<td>회원명</td>
							<td>{user.name}</td>
						</tr>
						<tr>
							<td>전화번호</td>
							<td>{user.phone}</td>
						</tr>
						<tr>
							<td>나이</td>
							<td>{user.age}</td>
						</tr>
						<tr>
							<td>생년월일</td>
							<td>{user.birth}</td>
						</tr>
						<tr>
							<td>이메일</td>
							<td>{user.email}</td>
						</tr>
						<tr>
							<td>주소</td>
							<td>{user.address}</td>
						</tr>
					</tbody>
				</table>
			</div>
			<div className={styles.buttonContainer}>
				<button className={styles.cancelButton} onClick={() => navigate(-1)}>
					돌아가다
				</button>
				<button
					className={`btn btn-danger ${styles.deleteButton}`}
					//onClick={() => navigate('/')}
				>
					탈퇴시키다
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

export default UpdateMember;
