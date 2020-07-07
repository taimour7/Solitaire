import React, {Component} from 'react';

class Countdown extends Component{
    constructor() {
        super();
        this.state = {
            seconds: 0,
        };
        setInterval(() => {
            this.setState({seconds: this.state.seconds+1})
        }, 1000);
    }


    render(){
        let minutes = Math.floor(this.state.seconds / 60);
        let seconds = this.state.seconds%60;

        if(minutes < 10) {
            minutes = "0" + minutes;
        }
        if(seconds < 10) {
            seconds = "0" + seconds
        }
        return(
            <div id="countdown2" className="timer">{minutes}:{seconds}</div>
        )
    }

}

export default Countdown;