import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getGoods } from '../services/GoodsService';
import { addRecentlyViewedGoods } from '../store/recentlyViewedSlice';
import { createcart } from '../services/CartService';
import Comments from '../components/Comments';
import { toast, ToastContainer } from 'react-toastify';
import styles from './css/Detail.module.css';

function Detail() {
	let { id } = useParams();
	let [findProduct, setFindProduct] = useState({});
	let dispatch = useDispatch();
	let [stock, setStock] = useState();
	let [orderNum, setOrderNum] = useState(1);
	const navigate = useNavigate();

	const [cartItem, setCartItem] = useState({});
	const [directItem, setDirectItem] = useState({});
	const user = sessionStorage.getItem('user');
	const userData = user ? JSON.parse(user) : { id: null }; // Null 체크 후 기본값 설정
	const member_id = userData.id;

	useEffect(() => {
		getGoods(id)
			.then((response) => {
				setFindProduct(response.data);
				setStock(response.data.stock);
			})
			.catch((error) => {
				console.error(error);
			});
	}, [id]);

	const handleDirectOrder = () => {
		setDirectItem({
			quantity: orderNum,
			member: { id: member_id },
			goods: { id: findProduct.id },
		});
	};

	useEffect(() => {
		if (directItem && directItem.member && directItem.goods) {
			createcart(directItem).then((response) => {
				navigate('/payment', {
					state: [
						{
							goods: response.data.goods,
							member: response.data.member,
							id: response.data.id,
							quantity: orderNum,
						},
					],
				});
			});
		}
	}, [directItem, navigate, orderNum]);

	const handleOrderClick = () => {
		setCartItem({
			quantity: orderNum,
			member: { id: member_id },
			goods: { id: findProduct.id },
		});
	};

	// 장바구니에 상품 갱신
	useEffect(() => {
		if (cartItem && cartItem.member && cartItem.goods) {
			const currentStock = createcart(cartItem)
				.then((response) => {
					toast.success('상품이 장바구니에 추가되었습니다!');
				})
				.catch((error) => {
					console.error('There was an error adding the cart item:', error);
				});
		}
	}, [cartItem]);

	// 최근 본 상품에 추가하기
	useEffect(() => {
		dispatch(addRecentlyViewedGoods(id));
	}, [dispatch, id]);

	return (
		<>
			<div className={styles.container}>
				<div className={styles.imageContainer}>
					<img
						src={findProduct.url}
						className={styles.image}
						alt="Product Image"
					/>
				</div>
				<div className={styles.detailsContainer}>
					<h4 className={styles.productTitle}>Name: {findProduct.name}</h4>
					<p className={styles.productDescription}>
						Description: {findProduct.description}
					</p>
					<p className={styles.productPrice}>Price: ${findProduct.price}</p>
					<p className={styles.productStock}>Stock: {findProduct.stock}</p>

					<div className={styles.inputContainer}>
						<input
							type="number"
							defaultValue="1"
							min="1"
							max={stock}
							className={styles.quantityInput}
							onCompositionStart={(e) => {
								e.target.blur();
								requestAnimationFrame(() => e.target.focus());
							}}
							onChange={(e) => {
								//	chkCharCode(e);
								if (e.target.value > stock) {
									e.target.value = stock;
								}
								setOrderNum(e.target.value);
							}}
						/>
						<button
							className={styles.buyButton}
							onClick={() => {
								if (userData.id == null) {
									navigate('/Login');
								} else if (stock === 0) {
									toast.error('품절입니다.');
								} else {
									if (orderNum <= 0) {
										toast.error('한 개 이상 주문해야 합니다.');
									} else {
										handleDirectOrder();
									}
								}
							}}
						>
							바로 구매
						</button>
						<button className={styles.orderButton} onClick={handleOrderClick}>
							장바구니에 담기
						</button>
					</div>
				</div>
			</div>
			<Comments goods_id={findProduct.id} member_id={member_id} />
			<ToastContainer />
		</>
	);
}

export default Detail;
