'use strict';

var getRandom = function (min, max) {
  return Math.round(Math.random() * (max - min) + min);
};

var titleData = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var addressData = String(getRandom(100, 1000)) + ', ' + String(getRandom(100, 1000));
var priceData = getRandom(1000, 1000000);
var typeData = ['palace', 'flat', 'house', 'bungalo'];
var roomsData = getRandom(1, 5);
var guestsData = getRandom(1, 10);
var checkData = ['12:00', '13:00', '14:00'];
var featuresData = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var places = [];
var map = document.querySelector('.map');
var similarPlacesTemplate = document.querySelector('template');
var filter = document.querySelector('map__filters-container');

var getAvatar = function (num) {
  return 'img/avatars/user0' + (num + 1) + '.png';
};

var getPhoto = function () {
  var photo = [];
  for (var i = 1; i < 4; i++) {
    photo[i - 1] = 'http://o0.github.io/assets/images/tokyo/hotel' + i + '.jpg';
  }
  return photo;
};

var getfeatures = function () {
  var featuresList = '';
  for (var i = 0; i < getRandom(1, 6); i++) {
    featuresList += featuresData[i] + ' ';
  }
  return featuresList;
};

var getType = function (i) {
  if (similarPlaces[i].offer.type === 'flat') {
    return 'Квартира';
  } else if (similarPlaces[i].offer.type === 'bungalo') {
    return 'Бунгало';
  } else if (similarPlaces[i].offer.type === 'house') {
    return 'Дом';
  } else if (similarPlaces[i].offer.type === 'palace') {
    return 'Дворец';
  }
  return similarPlaces[i].offer.type;
};

var getPlaces = function () {
  for (var i = 0; i < 8; i++) {
    places[i] = {
      author: {
        avatar: getAvatar(i)
      },
      offer: {
        title: titleData[i],
        address: addressData,
        price: priceData,
        type: typeData[getRandom(0, 3)],
        rooms: roomsData,
        guests: guestsData,
        checkin: checkData[getRandom(0, 2)],
        checkout: checkData[getRandom(0, 2)],
        features: getfeatures(),
        description: ' ',
        photos: getPhoto()
      },
      location: {
        x: getRandom(300, 900),
        y: getRandom(150, 500)
      }
    };
    if (places[i].offer.rooms > places[i].offer.guests) {
      places[i].offer.rooms = places[i].offer.guests;
    }
  }
  return places;
};

var similarPlaces = getPlaces();

document.querySelector('.map').classList.remove('map--faded');

var renderPin = function (place) {
  var pinElement = similarPlacesTemplate.content.querySelector('.map__pin').cloneNode(true);
  pinElement.style.left = place.location.x + 20 + 'px';
  pinElement.style.top = place.location.y + 40 + 'px';
  pinElement.querySelector('img').src = place.author.avatar;
  pinElement.querySelector('img').alt = place.offer.title;
  return pinElement;
};

var pushPins = function () {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < similarPlaces.length; i++) {
    fragment.appendChild(renderPin(similarPlaces[i]));
  }
  document.querySelector('.map__pins').appendChild(fragment);
};
pushPins();

var renderMap = function (place) {
  var mapElement = similarPlacesTemplate.content.querySelector('.map__card').cloneNode(true);
  mapElement.querySelector('.popup__title').textContent = place.offer.title;
  mapElement.querySelector('.popup__text--address').textContent = place.offer.address;
  mapElement.querySelector('.popup__text--price').textContent = place.offer.price + '₽/ночь';
  mapElement.querySelector('.popup__type').textContent = getType(0);
  mapElement.querySelector('.popup__text--capacity').textContent = place.offer.rooms + ' комнаты для ' + place.offer.guests + ' гостей.';
  mapElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + place.offer.checkin + ', выезд до ' + place.offer.checkout;
  mapElement.querySelector('.popup__features').textContent = place.offer.features;
  mapElement.querySelector('.popup__description').textContent = place.offer.description;
  mapElement.querySelector('.popup__avatar').src = place.author.avatar;
  mapElement.querySelector('.popup__photos').removeChild(mapElement.querySelector('.popup__photo'));
  for (var i = 0; i < 3; i++) {
    mapElement.querySelector('.popup__photos').insertAdjacentHTML('afterBegin', '<img src="" class="popup__photo" width="45" height="40" alt="Фотография жилья">');
    mapElement.querySelector('.popup__photo').src = place.offer.photos[i];
  }

  return mapElement;
};

var pushMap = function () {
  for (var i = 0; i < 1; i++) {
    var fragment = document.createDocumentFragment();
    fragment.appendChild(renderMap(similarPlaces[i]));
  }
  map.insertBefore(fragment, filter);
};

pushMap();

