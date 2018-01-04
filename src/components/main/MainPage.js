import React, { Component } from 'react';
import classNames from 'classnames';
import { Hand } from 'pokersolver';
import OpponentSpace from './OpponentSpace';


const cards = {
    spades: ['♠A', '♠2', '♠3', '♠4', '♠5', '♠6', '♠7', '♠8', '♠9', '♠10', '♠J', '♠Q', '♠K'],
    clovers: ['♣A', '♣2', '♣3', '♣4', '♣5', '♣6', '♣7', '♣8', '♣9', '♣10', '♣J', '♣Q', '♣K'],
    hearts: ['♥A', '♥2', '♥3', '♥4', '♥5', '♥6', '♥7', '♥8', '♥9', '♥10', '♥J', '♥Q', '♥K'],
    diamonds: ['♦A', '♦2', '♦3', '♦4', '♦5', '♦6', '♦7', '♦8', '♦9', '♦10', '♦J', '♦Q', '♦K']
};

const shapeMap = {
	'♠': 's',
	'♣': 'c',
	'♥': 'h',
	'♦': 'd'
}


export default class MainPage extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isIn: [true, true, true, true],
		};
    }

	togglePlayer = (evt) => {
		const playerNum = evt.target.dataset.playernum;
		const isIn = _.clone(this.state.isIn);
		isIn[playerNum] = !isIn[playerNum];
		
		this.setState({ isIn });
	}

    render() {
		const {
			isIn
		} = this.state;
		
		const createBtns = shape => (
			shape.map((e, i) => (
				<button
					key={i}
					className={classNames({
							'btn': true,
							'btn-default': true,
							'btn-sm': true,
							'btn-card': true,
							'text-red': ['♥', '♦'].indexOf(e[0][0]) > -1
					})}>
					{ e }
				</button>
			))
		);

		console.log(Hand.solve(['Ad', 'As', 'Jc', 'Th', '2d', 'Qs', 'Qd']));
			
		return (
			<main>
				<h1>Main Page</h1>

				<div className="row">
					<div className="col-sm-3">
						<OpponentSpace
							playerNum={0}
						    isIn={isIn[0]}
							onSwitchClick={this.togglePlayer} />
						<OpponentSpace
							playerNum={1}
							isIn={isIn[1]}
						    onSwitchClick={this.togglePlayer} />
					</div>
					<div className="col-sm-6">
						<div className="btn-space">
							<div>{ createBtns(cards.spades) }</div>
							<div>{ createBtns(cards.clovers) }</div>
							<div>{ createBtns(cards.hearts) }</div>
							<div>{ createBtns(cards.diamonds) }</div>
						</div>

						<div className="my-space">
							hello
						</div>
					</div>
					<div className="col-sm-3">
						<OpponentSpace
							playerNum={2}
							isIn={isIn[2]}
						    onSwitchClick={this.togglePlayer} />
						<OpponentSpace
							playerNum={3}
							isIn={isIn[3]}
						    onSwitchClick={this.togglePlayer} />
					</div>
					
				</div>
			</main>
		);
    }
}
