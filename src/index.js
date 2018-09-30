import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import axios from 'axios';
// import $ from 'jquery';

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
		this.speed = 500;
		this.rows = 3;
        this.cols = 6;
		this.state = {
			data:[],
			generation: 0,
			gridFull: Array(this.rows).fill().map(() => Array(this.cols).fill(false))
		}
		this.name="pause";
		
    }
    selectBox = (row, col) => {
        let gridCopy = arrayClone(this.state.gridFull);
        gridCopy[row][col] = !gridCopy[row][col];
        this.setState({
            gridFull: gridCopy
        });
    }
	get = ()=>{
        console.log(this.state.data[0])
	}

	loadState =()=>{
		axios.get(`https://game-o-life-api.herokuapp.com/api/state/`).then(
			res =>{
				for (let i = 0; i < res.data.length; i++) {
					console.log(res.data[i].row+'-'+res.data[i].column)
					let r=res.data[i].row;
					let c=res.data[i].column
					let gridCopy = arrayClone(this.state.gridFull);
					gridCopy[r][c] = !gridCopy[r][c];
					this.setState({
						gridFull: gridCopy
					});
				}
				clearInterval(this.intevalId);
				this.delete();
			}
		)
		this.name="resume";

	}

    check = () => {
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

	delete = ()=>{
		let g = this.state.gridFull;
		var d;
		for (let i = 0; i < this.rows; i++) {
			for (let j = 0; j < this.cols; j++) {
				if(g[i][j]){
					 d=[
						{
							"row": i,
							"column": j,
							"box": g[i][j],
						},
					]
					// console.log(data)
					
				}
			}
		  }
		  axios.delete(`https://game-o-life-api.herokuapp.com/api/delete/`,{data:d} )
					.then(res => {
						console.log(res);
						console.log(res.data);
					})
	}

	checkBox() {
		var checkBox=false;
		let g = this.state.gridFull;
		for (let i = 0; i < this.rows; i++) {
			for (let j = 0; j < this.cols; j++) {
				if(g[i][j]){
					checkBox=true;
				}
			}
		}
		return checkBox;
	}

	playButton = () =>{
		clearInterval(this.intevalId);
		this.intevalId = setInterval(this.check,this.speed);
		let g = this.state.gridFull;
		for (let i = 0; i < this.rows; i++) {
			for (let j = 0; j < this.cols; j++) {
				if(g[i][j]){
					this.name="resume"
				}
				else{
					this.name="pause"
				}
			}
		  }
		 
	}

	componentDidMount(){
		this.playButton();
	}

	removeInterval = () =>{
		if(this.name==="resume")
		{
			this.playButton();
		}
		else{
		clearInterval(this.intevalId);
		}

	}

	saveState = () =>{
		this.delete();
		let g = this.state.gridFull;
		for (let i = 0; i < this.rows; i++) {
			for (let j = 0; j < this.cols; j++) {
				if(g[i][j]){
					// const data={
					// 	"row": i,
					// 	"column": j,
					// 	"box": g[i][j],
					// }
					// console.log(data)
					axios.post(`https://game-o-life-api.herokuapp.com/api/state/`, { row:i,column:j,box:g[i][j] })
					.then(res => {
						console.log(res);
						console.log(res.data);
					})
				}
			}
		  }
		  this.get()
	}
    
    render(){
        return(
            <div><center>
				{/* <input type="text" placeholder="row"></input><br />
				<input type="text" placeholder="column"></input><br />
				<button onClick={this.gridSize}>create grid</button> */}

				<h1>Game Of Life</h1>
                <Grid
					gridFull={this.state.gridFull}
					rows={this.rows}
					cols={this.cols}
					selectBox={this.selectBox}
				/><br />
                
                <button onClick={this.playButton}>check</button>
				
				<button id="btn-rp" onClick={this.removeInterval}>{this.name}</button>

				<button onClick={this.saveState}>Save State</button>
				<button onClick={this.loadState}>Load State</button>
				{/* <button onClick={this.delete}>Delete All State</button> */}
				<h4>{this.state.generation}</h4>
				</center>
                
            </div>
        );
    }
}

ReactDOM.render(<Main />, document.getElementById('root'));
 
