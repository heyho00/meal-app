'use client'

import { useState, useEffect } from 'react';

export default function Result() {
  const [mapVisible, setMapVisible] = useState(false);
  const [location, setLocation] = useState({lat:0,lon:0})

  // 위치 정보 수집 권한 요청 함수
  const requestLocationPermission = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('위치 정보 수집 권한을 허용했습니다.');
          getLocation();
        },
        (error) => {
          console.error('위치 정보 수집 권한을 거부했습니다.', error);
          // 사용자에게 위치 정보 수집 권한을 허용하도록 유도하는 메시지를 표시합니다.
          alert('위치 정보 수집 권한을 허용해주세요.');
        }
      );
    } else {
      console.error('Geolocation API를 지원하지 않는 브라우저입니다.');
    }
  };

  // 위치 정보 가져오기
  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const obj = {lat:latitude, lon: longitude}
        setLocation(obj)
        console.log('현재 위치:', latitude, longitude);
        // 여기서 위도(latitude)와 경도(longitude)를 사용하여 원하는 작업을 수행합니다.
        // 예를 들어, 이 위치를 서버에 전송하여 주변 식당 정보를 가져올 수 있습니다.
        setMapVisible(true); // 위치 정보를 가져오면 지도를 표시합니다.
      },
      (error) => {
        console.error('위치 정보 가져오기 실패:', error);
        // 사용자에게 위치 정보 수집 권한을 허용하도록 유도하는 메시지를 표시합니다.
        alert('위치 정보 수집 권한을 허용해주세요.');
      }
    );
  };
  
  useEffect(() => {
    // 위치 정보 수집 권한 요청
    if (navigator.permissions) {
      navigator.permissions
        .query({ name: 'geolocation' })
        .then((permissionStatus) => {
          if (permissionStatus.state === 'granted') {
            // 위치 정보 수집 권한이 이미 허용된 상태이면 현재 위치를 가져옵니다.
            setMapVisible(true)
            getLocation();
          } else if (permissionStatus.state === 'prompt') {
            // 위치 정보 수집 권한을 요청합니다.
            requestLocationPermission();
          } else {
            // 위치 정보 수집 권한이 거부되었음을 사용자에게 알립니다.
            console.error('위치 정보 수집 권한이 거부되었습니다.');
            // 사용자에게 위치 정보 수집 권한을 허용하도록 유도하는 메시지를 표시합니다.
            alert('위치 정보 수집 권한을 허용해주세요.');
          }
        })
        .catch((error) => {
          console.error('위치 정보 권한 확인 실패:', error);
        });
    } else {
      console.error('Geolocation API를 지원하지 않는 브라우저입니다.');
    }
  }, []);

  useEffect(() => {
    // 구글 맵 API 스크립트를 동적으로 생성하여 추가합니다.
    if(location.lat){
      const script = document.createElement('script');
      const MAP_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY
    
      script.src = `https://maps.googleapis.com/maps/api/js?key=${MAP_API_KEY}&callback=initMap`;
      script.defer = true;
      script.async = true;

      // 스크립트를 document의 head에 추가합니다.
      document.head.appendChild(script);

      // initMap 함수를 전역으로 정의하여 API 로드 후 실행할 콜백 함수를 작성합니다.
      window.initMap = initMap;
    }

  }, [location]);

  const initMap = () => {
    if (mapVisible) {
      // 지도 초기화 및 표시할 위치 설정
      const map = new window.google.maps.Map(document.getElementById('map'), {
        center: { lat: location.lat, lng: location.lon }, // 이곳은 서울의 위도와 경도입니다. 원하는 위치로 수정하세요.
        zoom: 10, // 초기 확대 수준
      });

      // 지도에 마커 추가 예시
      const marker = new window.google.maps.Marker({
        position: { lat: location.lat, lng: location.lon }, // 마커를 추가할 위치
        map, // 지도 인스턴스
        title: 'place', // 마커에 표시할 타이틀
      });
    }
  };

  return (
    <>
      {mapVisible ? location.lat ? ( 
        <div className="flex flex-col items-center justify-center h-screen">
          <div className="bg-white p-8 rounded-lg shadow w-[30rem]">
            <h1 className="text-2xl mb-4">먹자 !</h1>
            <div id="map" style={{ width: '100%', height: '500px' }}></div>
          </div>
        </div>
      ):(
        <div className="flex flex-col items-center justify-center h-screen">
          <div className="bg-white p-8 rounded-lg shadow w-[30rem]">
            <h1 className="text-3xl mb-4">죽이는 맛집을 추천해주지 !</h1>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-screen">
          <div className="bg-white p-8 rounded-lg shadow w-[30rem]">
            <h1 className="text-2xl mb-4">먹자 !</h1>
            <p>위치 정보 수집 권한을 허용해주세요.</p>
          </div>
        </div>
      )}
      <div className="h-24" />
    </>
  );
}