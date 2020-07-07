import React, {Component} from 'react';
import './styles.css';

class Card extends Component {
    render(){
        const { card, style, isDealtCard, onClick } = this.props;
        if (!card.flipped){
            return(
                <div className = {`cards abs-position flipped-card`} style={style}>
                </div>
            )
        }
        return(
            <div className =
                     {`cards 
                     ${card.color} 
                     ${isDealtCard ? "abs-position" : ''}
                     ${card.selected ? 'is-selected' : ''}`}
                 style={style}
                 onClick={onClick}
                 draggable
            >
                <div className ="suit">{card.suit}</div>
                <div className ="big-suit">{card.suit}</div>
                <div className ="corner-number">{card.displayRank}</div>
            </div>

        )
    }
}

export default Card;