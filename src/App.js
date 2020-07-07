import React, {Component} from 'react';
import './App.css';
import Card from './components/cards/card';
import Countdown from "./components/timer";


class Deck extends Component {
    constructor(props) {
        super(props);
        const deckOfCards = this.createDeck();
        this.state = {
            deck: deckOfCards,
            currentIndex: 0,
            dealtCards: [],
            gameStarted: false,
            selectedCard: {},
            inputName: null,
            home: [[],[],[],[]]
        }
    }

    createDeck = () => {
        const suits = ["♧", "♡", "♢", "♤"];
        const deck = [];
        let color;
        suits.map(suit => {
            for (let i = 1; i <= 13; i++) {
                suit === "♧" || suit === "♤" ? (color = "black") : (color = "red");
                deck.push({
                    rank: i,
                    displayRank: i,
                    suit: suit,
                    color: color,
                    flipped: false,
                    selected: false
                });
            }
            return deck;
        });

        for (let j = 0; j < deck.length; j++) {
            if (deck[j].displayRank === 1) {
                deck[j].displayRank = "A";
            }
            if (deck[j].displayRank === 11) {
                deck[j].displayRank = "J";
            }
            if (deck[j].displayRank === 12) {
                deck[j].displayRank = "Q";
            }
            if (deck[j].displayRank === 13) {
                deck[j].displayRank = "K";
            }
        }

        const shuffleDeck = [];
        while (shuffleDeck.length < 52) {
            let index = Math.floor(Math.random() * deck.length);
            shuffleDeck.push(deck[index]);
            deck.splice(index, 1);
        }
        return shuffleDeck;
    };

    nextCard = () => {
        let newIndex = this.state.currentIndex + 1;
        if (newIndex >= this.state.deck.length) {
            newIndex=0
        }
        this.setState({currentIndex: newIndex})
    };

    dealCards = () => {
        let dealtCards = [[],[],[],[],[],[],[]];
        let deck = this.state.deck;
        for (let i = 0; i < 7; i++) {
            for (let j = 0; j <= i; j++) {
                let card = deck.splice(0,1)[0];
                if( i === j){card.flipped = true}
                dealtCards[i].push(card)
            }
        }
        for( let i=0; i<deck.length; i++){
            deck[i].flipped = true;
        }
        this.setState({deck: deck, dealtCards: dealtCards, gameStarted: true, inputName: document.getElementById("nameInput").value})
    };

    deckClick = (card, col, row) =>{
        let newDealtCards = [...this.state.dealtCards];
        let newDeckCards = [...this.state.deck];
        let selectedCard = card;
        let newCurrentIndex = this.state.currentIndex;
        let home = [...this.state.home]

        // if no card is selected then select the clicked card
        if (!this.state.selectedCard) {
            for (let i = 0; i < newDeckCards.length; i++) {
                if (newDeckCards[i].selected) {
                    newDeckCards[i].selected = false;
                }
            }
            for (let i = 0; i < newDealtCards.length; i++) {
                for (let j = 0; j < newDealtCards[i].length; j++) {
                    if (newDealtCards[i][j].selected) {
                        newDealtCards[i][j].selected = false;
                    }
                }
            }
            for (let i = 0; i < home.length; i++) {
                for (let j = 0; j < home[i].length; j++) {
                    if (home[i][j].selected) {
                        home[i][j].selected = false;
                    }
                }
            }

            if (newDealtCards[col][row].flipped) {
                newDealtCards[col][row].selected = true;
            }

            // if (newDealtCards[col][row].flipped) {
            //     for (let i = 0; i < newDealtCards[col].length; i++) {
            //         if(i>=row){
            //             newDealtCards[col][i].selected = true;
            //         }
            //     }
            // }
        }

// a card is selected and can be moved

        else if(card.flipped
            && this.state.selectedCard.rank === newDealtCards[col][newDealtCards[col].length-1].rank - 1
            && this.state.selectedCard.color !== card.color){
            let cardToMoveCol;
            let cardToMoveRow;
            for (let i = 0; i < newDealtCards.length; i++) {
                for (let j = 0; j < newDealtCards[i].length; j++) {
                    if (newDealtCards[i][j].selected){
                        cardToMoveCol=i;
                        cardToMoveRow=j;
                    }
                }
            }

            // the selected card is from the deck
            if(cardToMoveCol >=0 && cardToMoveRow >=0){
                let removedCard = newDealtCards[cardToMoveCol].splice(cardToMoveRow, newDealtCards[cardToMoveCol].length - cardToMoveRow)
                newDealtCards[col].push(...removedCard)
                if(newDealtCards[cardToMoveCol].length>0){
                    newDealtCards[cardToMoveCol][newDealtCards[cardToMoveCol].length-1].flipped=true
                }
            }
            // the selected card is from the dealer
            else {
                let removedCard = newDeckCards.splice(newCurrentIndex, 1)
                newDealtCards[col].push(...removedCard)
                if(newCurrentIndex>0) {
                    newCurrentIndex = newCurrentIndex - 1;
                }
            }

            for (let i = 0; i < newDealtCards.length; i++) {
                for (let j = 0; j < newDealtCards[i].length; j++) {
                    if (newDealtCards[i][j].selected) {
                        newDealtCards[i][j].selected = false;
                    }
                }
            }

            for (let i = 0; i < newDeckCards.length; i++) {
                newDeckCards[i].selected = false;
            }

            selectedCard = null
        }else{
            for (let i = 0; i < newDealtCards.length; i++) {
                for (let j = 0; j < newDealtCards[i].length; j++) {
                    if (newDealtCards[i][j].selected) {
                        newDealtCards[i][j].selected = false;
                    }
                }
            }

            for (let i = 0; i < newDeckCards.length; i++) {
                newDeckCards[i].selected = false;
            }

            if (newDealtCards[col][row].flipped) {
                newDealtCards[col][row].selected = true;
            }
        }

        this.setState({selectedCard: selectedCard, dealtCards: newDealtCards, deck: newDeckCards, currentIndex: newCurrentIndex, home: home})
    };

    dealerClick = (index) =>{
        let newDeckCards = [...this.state.deck];
        let dealtCards = [...this.state.dealtCards];
        let home = [...this.state.home]

        for(let i=0; i< newDeckCards.length; i++){
            if(newDeckCards[i].selected){
                newDeckCards[i].selected = false;
            }
        }
        for (let i=0; i<dealtCards.length; i++){
            for (let j = 0; j <dealtCards[i].length; j++) {
                if (dealtCards[i][j].selected) {
                    dealtCards[i][j].selected = false;
                }
            }}

        for (let i=0; i<home.length; i++){
            for (let j = 0; j <home[i].length; j++) {
                if (home[i][j].selected) {
                    home[i][j].selected = false;
                }
            }}

        newDeckCards[index].selected = true;

        this.setState({deck: newDeckCards, dealtCards: dealtCards, selectedCard : newDeckCards[index], home: home})
    };

    resetGame = () =>{
        window.location.reload(false)
    }

    placeKing = (columnIndex) => {
        let newDealtCards = [...this.state.dealtCards];
        let newCurrentIndex = this.state.currentIndex;
        let newDeckCards = [...this.state.deck];
        let cardToMoveCol;
        const {dealtCards} = this.state
        const newDeck = [...dealtCards]

        //From deck

        for (let i = 0; i < newDeck.length; i++) {
            for (let j = 0; j < newDeck[i].length; j++) {
                if (newDeck[i][j].selected && newDeck[i][j].rank===13) {
                    newDeck[i][j].selected = false
                    cardToMoveCol=i;
                    const selectedCard = newDeck[i].splice(j, newDeck[i].length - j)
                    newDeck[columnIndex].push(...selectedCard)
                    if(newDeck[i].length>0) {
                        newDealtCards[cardToMoveCol][newDealtCards[cardToMoveCol].length - 1].flipped = true
                    }
                }
            }
        }

        //From dealer

        for (let i = 0; i < newDeckCards.length; i++) {
            if (newDeckCards[i].selected && newDeckCards[i].rank===13) {
                newDeckCards[i].selected = false;
                const selectedDealerCard = newDeckCards.splice(i, 1)
                selectedDealerCard.flipped = true;
                newDeck[columnIndex].push(...selectedDealerCard)
                if(newCurrentIndex>0) {
                    newCurrentIndex = newCurrentIndex - 1;
                }
            }
        }
        this.setState({dealtCards: newDeck, deck: newDeckCards})
    }

    placeAce = (aceIndex) => {
        debugger
        let home = [...this.state.home]
        let newDealtCards = [...this.state.dealtCards];
        let selectedCard;
        let newCurrentIndex = this.state.currentIndex;
        let newDeckCards = [...this.state.deck];
        let dealerSelectedCardIndex;
        let selectedDealtCardRow;
        let selectedDealtCardColumn;


        for (let i = 0; i < newDealtCards.length; i++) {
            for (let j = 0; j < newDealtCards[i].length; j++) {
                if(newDealtCards[i][j].selected){
                    selectedDealtCardRow = j
                    selectedDealtCardColumn = i
                }
            }
        }
        for(let i = 0; i< newDeckCards.length; i++){
            if(newDeckCards[i].selected){
                dealerSelectedCardIndex=i
            }
        }

        if (home[aceIndex].length < 1) {
            if(dealerSelectedCardIndex >= 0) {
                if(newDeckCards[dealerSelectedCardIndex].rank===1){
                    newDeckCards[dealerSelectedCardIndex].selected = false;
                    let removedCard = newDeckCards.splice(dealerSelectedCardIndex, 1)
                    home[aceIndex].push(...removedCard)
                    if (newCurrentIndex > 0) {
                        newCurrentIndex = newCurrentIndex - 1;
                    }
                }
            }else if(selectedDealtCardColumn >= 0 && selectedDealtCardRow >= 0){
                if(newDealtCards[selectedDealtCardColumn][selectedDealtCardRow].rank===1) {
                    newDealtCards[selectedDealtCardColumn][selectedDealtCardRow].selected = false
                    selectedCard = newDealtCards[selectedDealtCardColumn].splice(selectedDealtCardRow, 1);
                    home[aceIndex].push(...selectedCard);
                    if (newDealtCards[selectedDealtCardColumn].length > 0) {
                        newDealtCards[selectedDealtCardColumn][newDealtCards[selectedDealtCardColumn].length - 1].flipped = true
                    }
                }
            }
        }else{
            if(dealerSelectedCardIndex >= 0) {
                if (newDeckCards[dealerSelectedCardIndex].rank === this.state.home[aceIndex][this.state.home[aceIndex].length -1].rank + 1
                    && newDeckCards[dealerSelectedCardIndex].suit === this.state.home[aceIndex][this.state.home[aceIndex].length -1 ].suit){
                    newDeckCards[dealerSelectedCardIndex].selected = false;
                    let removedCard = newDeckCards.splice(dealerSelectedCardIndex, 1)
                    home[aceIndex].push(...removedCard)
                    if (newCurrentIndex > 0) {
                        newCurrentIndex = newCurrentIndex - 1;
                    }
                }
            }else if(selectedDealtCardColumn >= 0 && selectedDealtCardRow >= 0){
                if (newDealtCards[selectedDealtCardColumn][selectedDealtCardRow].rank === this.state.home[aceIndex][this.state.home[aceIndex].length -1 ].rank + 1
                    && newDealtCards[selectedDealtCardColumn][selectedDealtCardRow].suit === this.state.home[aceIndex][this.state.home[aceIndex].length -1 ].suit) {
                    newDealtCards[selectedDealtCardColumn][selectedDealtCardRow].selected = false
                    selectedCard = newDealtCards[selectedDealtCardColumn].splice(selectedDealtCardRow, 1);
                    home[aceIndex].push(...selectedCard);
                    if (newDealtCards[selectedDealtCardColumn].length > 0) {
                        newDealtCards[selectedDealtCardColumn][newDealtCards[selectedDealtCardColumn].length - 1].flipped = true
                    }
                }
            }
        }
        this.setState({dealtCards: newDealtCards, home: home, deck: newDeckCards, currentIndex: newCurrentIndex, selectedCard:null})
    }

    render(){
        if(!this.state.gameStarted){
            return(
                <div className="sg-container">
                    <div className="title-card" />
                    <input
                        type="text"
                        placeholder="Enter your name"
                        className="name-input"
                        id="nameInput"
                        maxLength="15"
                    />
                    <button className="buttons" onClick={this.dealCards}>START GAME!</button>
                    <div className="author">Coded by Taimour Habib</div>
                </div>
            )
        }
        return (
            <div className="parent">
                <div className="reset-info">
                    <div className="input-name">{this.state.inputName}</div>
                    <Countdown />
                    <button className={`buttons reset-button`} onClick={this.resetGame}>New Game</button>
                    <div>{this.state.home}</div>
                </div>
                <div className="dealer-container">
                    <button className="next-card" onClick={this.nextCard}> </button>
                    <div className="dealer">
                        {this.state.deck[this.state.currentIndex] &&
                        <Card
                            card={this.state.deck[this.state.currentIndex]}
                            onClick={() => this.dealerClick(this.state.currentIndex)}
                        />}
                    </div>
                    <div className="home-container">
                        {this.state.home.map((a, aceIndex)=>{
                            return (
                                <div className="column" onClick={()=>this.placeAce(aceIndex)}>
                                    {a.length>0 ? <Card card={a[a.length-1]}/> : ""}
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div className= "dealt-cards">
                    {this.state.dealtCards.map((column, columnIndex) => {
                        if(column.length<1){
                            return(
                                <div onClick={()=>this.placeKing(columnIndex)} className={"column"} />
                            )
                        }
                        return (
                            <div onDrop className= "column">
                                {column.map((card, rowIndex) => {
                                    return (
                                        <Card
                                            card={card}
                                            style={{top: `${rowIndex*50}px`}}
                                            isDealtCard={true}
                                            onClick={() => this.deckClick(card, columnIndex, rowIndex)}
                                        />
                                    )}
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }
}


export default Deck;