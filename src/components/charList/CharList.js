import './charList.scss';
import useMarvelService from '../../services/MarvelService';
import React, { useState, useEffect, useRef} from 'react';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import PropTypes from 'prop-types';

const CharList = (props) => {

    

    const [chars, setChars] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(294);
    const [charEnded, setCharEnded] = useState(false);

    const {loading, error, getAllCharacters} = useMarvelService();

    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        getAllCharacters(offset)
            .then(res => onCharsLoaded(res));
    }

    const onCharsLoaded = (newChars) =>  {
        let ended = false;
        if(newChars.length < 9) {
            ended = true;
        }

        setChars(chars => [...chars, ...newChars]);   
        setNewItemLoading(newItemLoading => false);  
        setOffset(offset => offset + 9);
        setCharEnded(charEnded => ended);
    }

    useEffect(() => {
        onRequest(offset, true);
    }, []);

    //Використовуємо рефи для створення фокусу на карточка
    //Щоб ми могли переключатись між ними за допомогою ТАБІВ
    const itemRefs = useRef([]);

    const focusOnItem = (id) => {
        itemRefs.current[id].focus();
    } 

    function renderItems(arr) {
        const items = arr.map((item, i) => {
            if(item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/f/50/4c0040744c205.jpg') {
                item.thumbnail = 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg';
            }
            let imgStyle = {'objectFit' : 'cover'};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg' || 'http://i.annihil.us/u/prod/marvel/i/mg/f/60/4c002e0305708.gif') {
                imgStyle = {'objectFit' : 'unset'};
            }

            return (
                <li 
                    className='char__item'
                    tabIndex={0}
                    ref={el => itemRefs.current[i] = el}
                    key={item.id}
                    onClick={() => {
                        props.onCharSelected(item.id);
                        focusOnItem(i);
                    }}
                    onKeyPress={(e) => {
                        if(e.key === ' ' || e.key === "Enter") {
                            props.onCharSelected(item.id);
                            focusOnItem(i);
                        }
                    }} >
                        <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
                        <div className='char__name'>{item.name}</div>
                    </li>
            )
        });

        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }

    console.log('charlist');

    const items = renderItems(chars);

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading && !newItemLoading ? <Spinner /> : null;
    const content = error ? null : items;

    return (
        <div className="char__list">
            <ul className="char__grid">
                {errorMessage}
                {spinner}
                {content}
            </ul>
            <button 
                className="button button__main button__long"
                disabled={newItemLoading}
                style={{'display': charEnded ? 'none' : 'block'}}
                onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
    
}

CharList.propTypes = {
    onCharSelected: PropTypes.func
}


export default CharList;