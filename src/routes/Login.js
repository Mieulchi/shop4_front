import './Login.css'
import {useState} from 'react'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
function Login() {

  const navigate = useNavigate();

  let [userId,setUserId] = useState("");
  let [userPw,setUserPw] = useState("");

  // 아이디와 비밀번호 입력받는 값 저장
  const userIdChange = (e) => setUserId(e.target.value);
  const userPwChange = (e) => setUserPw(e.target.value);

  //formData를 JSON으로 변환하는 함수
  const formDataToJSON = (formData) => {
    const obj = {};
    formData.forEach((value, key) => {
      obj[key] = value;
    });
    return obj;
  };

  // 로그인 버튼 누르면 로그인 기능 실행
  const onSubmit = (e) => {
    e.preventDefault();

    let formData = new FormData();
    formData.append("userId", userId);
    formData.append("userPw", userPw);

    const data = formDataToJSON(formData);  

    //포스트 요청으로 아이디 비밀번호 값 보내기
    axios.post("http://localhost:8080/api/members/login",{
     userId:userId,
     userPw:userPw 
    })
    .then((res)=>{
      //받아온 데이터 세션에 저장하는 로직추가 해야됨


      alert(res.data.name + "님 어서오세요!");
      navigate('/');
    })
    .catch(function(error) {
      alert("로그인에 실패하였습니다.");
    })
  }



  return (
      <>
        <form className="memberForm" onSubmit={onSubmit} encType="multipart/form">
          
          {/* 아이디 입력 칸 */}
          <div className="mb-3">
            <input type="text" value={userId} onChange={userIdChange} 
              className="form-control" placeholder="아이디"/>
          </div>
          
          {/* 비밀번호 입력칸 */}
          <div className="mb-3">
            <input type="text" value={userPw} onChange={userPwChange} 
              className="form-control" placeholder="비밀번호"/>
          </div>
          
          
          <div className="mb-3 form-check">
            {/* 아이디 저장 체크박스 */}
            <input type="checkbox" className="member" id="checkId"/>
            <label htmlFor="checkId">아이디 저장</label>
            
            {/* 자동 로그인 체크박스 */}
            <input type="checkbox" className="member" id="autoLogin"/>
            <label htmlFor="autoLogin">자동로그인</label>
          </div>
          
          {/* 로그인 버튼 */}
          <button type="submit" className="btn btn-primary"
            value="user login">로그인</button>
          
          {/* 찾기,휴면해제,회원가입 */}
          <ul className="findRemove">
            <li>아이디/비밀번호 찾기</li>    
            <li>휴면해제</li>
            <li>회원가입</li>
          </ul>

        </form>
        
        
      </>
  )
}

export default Login;