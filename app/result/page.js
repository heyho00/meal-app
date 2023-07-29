"use client";

import StarRating from "@/components/StarRating";
import { useState, useEffect, ReactDOM } from "react";

export default function Result() {
  const [mapVisible, setMapVisible] = useState(false);
  const [location, setLocation] = useState({ lat: 0, lon: 0 });
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [placeInfo, setPlaceInfo] = useState(null);

  const initMap = () => {
    if (window.google && window.google.maps && mapVisible && location.lat) {
      const map = new window.google.maps.Map(document.getElementById("map"), {
        center: { lat: location.lat, lng: location.lon },
        zoom: 15, // 좀 더 자세히 보기 위해 확대 수준을 조정합니다.
      });

      // 주변 식당 정보를 가져오기 위한 요청 파라미터 설정
      const request = {
        location: new window.google.maps.LatLng(location.lat, location.lon),
        radius: 1000, // 주변 500m 이내의 식당을 검색합니다.
        type: "restaurant", // 식당으로 필터링합니다.
      };

      // PlacesService를 사용하여 주변 식당 정보를 가져옵니다.
      const service = new window.google.maps.places.PlacesService(map);
      service.nearbySearch(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          if (results.length > 0) {
            // 가능한 결과 범위 내에서 랜덤한 인덱스 선택
            const randomIndex = Math.floor(Math.random() * results.length);
            const place = results[randomIndex];
            // 랜덤하게 선택된 장소에 대한 마커 생성
            new window.google.maps.Marker({
              position: place.geometry.location,
              map,
              title: place.name,
            });
            setPlaceInfo({
              name: place.name,
              icon: place.icon,
              rating: place.rating,
            });
          }
        }
      });
    }
  };

  // 위치 정보 수집 권한 요청 함수
  const requestLocationPermission = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("위치 정보 수집 권한을 허용했습니다.");
          getLocation();
        },
        (error) => {
          console.error("위치 정보 수집 권한을 거부했습니다.", error);
          // 사용자에게 위치 정보 수집 권한을 허용하도록 유도하는 메시지를 표시합니다.
          alert("위치 정보 수집 권한을 허용해주세요.");
        }
      );
    } else {
      console.error("Geolocation API를 지원하지 않는 브라우저입니다.");
    }
  };

  // 위치 정보 가져오기
  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const obj = { lat: latitude, lon: longitude };
        setLocation(obj);
        console.log("현재 위치:", latitude, longitude);
        // 여기서 위도(latitude)와 경도(longitude)를 사용하여 원하는 작업을 수행합니다.
        // 예를 들어, 이 위치를 서버에 전송하여 주변 식당 정보를 가져올 수 있습니다.
        setMapVisible(true); // 위치 정보를 가져오면 지도를 표시합니다.
      },
      (error) => {
        console.error("위치 정보 가져오기 실패:", error);
        // 사용자에게 위치 정보 수집 권한을 허용하도록 유도하는 메시지를 표시합니다.
        alert("위치 정보 수집 권한을 허용해주세요.");
      }
    );
  };

  useEffect(() => {
    // 위치 정보 수집 권한 요청
    if (navigator.permissions) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then((permissionStatus) => {
          if (permissionStatus.state === "granted") {
            // 위치 정보 수집 권한이 이미 허용된 상태이면 현재 위치를 가져옵니다.
            setMapVisible(true);
            getLocation();
          } else if (permissionStatus.state === "prompt") {
            // 위치 정보 수집 권한을 요청합니다.
            requestLocationPermission();
          } else {
            // 위치 정보 수집 권한이 거부되었음을 사용자에게 알립니다.
            console.error("위치 정보 수집 권한이 거부되었습니다.");
            // 사용자에게 위치 정보 수집 권한을 허용하도록 유도하는 메시지를 표시합니다.
            alert("위치 정보 수집 권한을 허용해주세요.");
          }
        })
        .catch((error) => {
          console.error("위치 정보 권한 확인 실패:", error);
        });
    } else {
      console.error("Geolocation API를 지원하지 않는 브라우저입니다.");
    }
  }, []);

  useEffect(() => {
    // 구글 맵 API 스크립트를 동적으로 생성하여 추가합니다.
    if (location.lat && !window.google) {
      const script = document.createElement("script");
      const MAP_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY;

      script.src = `https://maps.googleapis.com/maps/api/js?key=${MAP_API_KEY}&libraries=places&callback=initMap`;
      script.defer = true;
      script.async = true;

      script.onload = () => {
        setScriptLoaded(true);
      };

      // 스크립트를 document의 head에 추가합니다.
      document.head.appendChild(script);
    }
  }, [location]);

  useEffect(() => {
    if (scriptLoaded && location.lat) {
      initMap(location);
    }
  }, [scriptLoaded, location]);

  return (
    <div className="mt-24">
      {mapVisible ? (
        location.lat ? (
          <>
            <div className="flex flex-col items-center justify-center h-screen">
              <div className="bg-white p-8 rounded-lg shadow w-[30rem]">
                <h1 className="text-5xl mb-4 flex"> {placeInfo?.name}!</h1>
                <StarRating rating={placeInfo?.rating} />
                <div id="map" style={{ width: "100%", height: "500px" }}></div>
              </div>
            </div>
            <div className="mt-4"></div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-screen">
            <div className="bg-white p-8 rounded-lg shadow w-[30rem]">
              <h1 className="text-3xl mb-4">죽이는 맛집을 추천해주지 !</h1>
            </div>
          </div>
        )
      ) : (
        <div className="flex flex-col items-center justify-center h-screen">
          <div className="bg-white p-8 rounded-lg shadow w-[30rem]">
            <h1 className="text-2xl mb-4">먹자 !</h1>
            <p>위치 정보 수집 권한을 허용해주세요.</p>
          </div>
        </div>
      )}
      <div className="h-24" />
    </div>
  );
}
