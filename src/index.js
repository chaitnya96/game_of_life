import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Box extends React.Component {
	selectBox = () => {
		this.props.selectBox(this.props.row, this.props.col);
	}
    
	render() {
		return (
			<div
				className={this.props.boxClass}
				id={this.props.id}
				onClick={this.selectBox}
			/>
		);
	}
}

class Grid extends React.Component {
	render() {
		const width = (this.props.cols * 16);
		var rowsArr = [];

		var boxClass = "";
		for (var i = 0; i < this.props.rows; i++) {
			for (var j = 0; j < this.props.cols; j++) {
				let boxId = i + "_" + j;

				boxClass = this.props.gridFull[i][j] ? "box on" : "box off";
				rowsArr.push(
					<Box
						boxClass={boxClass}
						key={boxId}
						boxId={boxId}
						row={i}
						col={j}
						selectBox={this.props.selectBox}
					/>
				);
			}
		}
		return (
			<div className="grid" style={{width: width}}>
				{rowsArr}
			</div>
		);
	}
}
function arrayClone(arr) {
    return JSON.parse(JSON.stringify(arr));
}
class Main extends React.Component{
    constructor() {
		super();
		this.speed = 3000;
		this.rows = 10;
        this.cols = 10;
		this.state = {
			generation: 0,
			gridFull: Array(this.rows).fill().map(() => Array(this.cols).fill(false))
        }
        
    }
    selectBox = (row, col) => {
        let gridCopy = arrayClone(this.state.gridFull);
        gridCopy[row][col] = !gridCopy[row][col];
        this.setState({
            gridFull: gridCopy
        });
    }

    check = () => {
		this.st=true;
		let g = this.state.gridFull;
		let g2 = arrayClone(this.state.gridFull);

		for (let i = 0; i < this.rows; i++) {
		  for (let j = 0; j < this.cols; j++) {
		    let count = 0;
		    if (i > 0) if (g[i - 1][j]) count++;
		    if (i > 0 && j > 0) if (g[i - 1][j - 1]) count++;
		    if (i > 0 && j < this.cols - 1) if (g[i - 1][j + 1]) count++;
		    if (j < this.cols - 1) if (g[i][j + 1]) count++;
		    if (j > 0) if (g[i][j - 1]) count++;
		    if (i < this.rows - 1) if (g[i + 1][j]) count++;
		    if (i < this.rows - 1 && j > 0) if (g[i + 1][j - 1]) count++;
		    if (i < this.rows - 1 && j < this.cols - 1) if (g[i + 1][j + 1]) count++;
		    if (g[i][j] && (count < 2 || count > 3)) g2[i][j] = false;
		    if (!g[i][j] && count === 3) g2[i][j] = true;
		  }
        }
		this.setState({
		  gridFull: g2,
		  generation: this.state.generation + 1
        });
        
	}
	
	clear = () => {
		var grid = Array(this.rows).fill().map(() => Array(this.cols).fill(false));
		this.setState({
			gridFull: grid,
			generation: 0
		});
	}

	gridSize = () => {
				this.cols = 20;
				this.rows = 10;
		this.clear();

	}

	playButton = () =>{
		clearInterval(this.intevalId);
		this.intevalId = setInterval(this.check,this.speed);
	}

	componentDidMount(){
		this.playButton();
	}

	removeInterval = () =>{
		clearInterval(this.intevalId);
	}
    
    render(){
        return(
            <div><center>
				<input type="text" placeholder="row"></input><br />
				<input type="text" placeholder="column"></input><br />
				<button onClick={this.gridSize}>create grid</button>
                <Grid
					gridFull={this.state.gridFull}
					rows={this.rows}
					cols={this.cols}
					selectBox={this.selectBox}
				/><br />
                
                <button onClick={this.playButton}>check</button>
				<button onClick={this.removeInterval}>pause</button>
				</center>
                <h2>genration : {this.state.genration}</h2>
            </div>
        );
    }
}

ReactDOM.render(<Main />, document.getElementById('root'));
 
