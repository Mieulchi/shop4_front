import { Wheel } from "react-custom-roulette"; // 룰렛 import
import React, { useState } from "react";
import { listCoupons } from "../services/CouponService";

function CouponRoulette() {
  // 1. 쿠폰 종류 읽어오기
  const [coupon, setCoupon] = useState([]);
  useState(() => {
    const getAllCoupon = async () => {
      // const res = await listCoupons();
    };
    getAllCoupon();
  }, [coupon]);
  // 2. 뽑기 진행

  // 3. 쿠폰 매핑 시켜

  //룰렛 데이터
  const data = [
    {
      option: "Apple Vision Pro",
      style: { backgroundColor: "gray", textColor: "white" },
      percentage: 20,
    },
    {
      option: "LG TV",
      style: { backgroundColor: "red", textColor: "white" },
      percentage: 20,
    },
    {
      option: "SAMSUNG 에어컨",
      style: { backgroundColor: "blue", textColor: "white" },
      percentage: 20,
    },
    {
      option: "꽝",
      style: { backgroundColor: "white", textColor: "red" },
      percentage: 20,
    },
  ];
  console.log(data[0]);

  //룰렛이 회전 애니메이션을 시작
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0); //당첨 인덱스

  // 룰렛 애니메이션을 실행시킬 함수
  const handleSpinClick = () => {
    if (!mustSpin) {
      // 가중치 랜덤 알고리즘(Weighted Random Picker) 적용
      // 1. 랜덤 기준점 설정
      const pivot = Math.floor(Math.random() * 99 + 1);
      let stack = 0; // 가중치

      let percentage = data.map((row, idx) => {
        {
          return row.percentage;
        }
      });

      let newPrizeNumber = null; //당첨 인덱스

      percentage.some((row, idx) => {
        //2. 가중치 누적
        stack += row;

        // 3. 누적 가중치 값이 기준점 이상이면 종료
        if (pivot <= stack) {
          newPrizeNumber = idx;
          return true;
        }
      });
      // 당첨 인덱스를 가리킴
      setPrizeNumber(newPrizeNumber);
      setMustSpin(true);
    }
  };

  // 룰렛 애니메이션이 멈출 때 실행되는 함수
  const StopSpinning = () => {
    setMustSpin(false);
    alert(data[prizeNumber].option + "이 당첨되셨습니다");
  };
  return (
    <>
      <div>
        <Wheel
          spinDuration={0.2} // spin속도
          //디폴트 위치 랜덤으로
          startingOptionIndex={Math.floor(Math.random() * data.length)}
          mustStartSpinning={mustSpin}
          prizeNumber={prizeNumber}
          data={data}
          onStopSpinning={StopSpinning}
        />
        <button onClick={handleSpinClick}>SPIN</button>
        <div>{prizeNumber}</div>
      </div>
    </>
  );
}

export default CouponRoulette;
