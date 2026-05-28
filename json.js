let table = document.getElementById('table');
table.width = window.innerWidth;
//table.width = 600;
table.height = window.innerHeight;
//table.height = 600;
let ctx = table.getContext("2d");
ctx.font = "10px Arial";
table.onclick = tableClick;
document.onkeyup = keysOff;
let offset = 10;
let w = 1; //ball width
let h = 6; //ball height
let timer; //Frames
let fps = 30; //Frames per second
let deltaTime = 1000 / fps; //Time between last and current frame
let time = 0; //Program's current life time
let grid;
fetch("https://raw.githubusercontent.com/CodexOne03/GOL/refs/heads/main/Blinker.json").then((res) => res.text()).then((text) =>
{
	console.log(text);
	let template = JSON.parse(text);
	table.width = template.gridWidth * offset;
	table.height = template.gridHeight * offset;
	grid = new Array(Math.trunc(table.height / offset));
	for (var i = 0; i < grid.length; i++)
	{
		grid[i] = new Array(Math.trunc(table.width / offset));
		for (let j = 0; j < grid[i].length; j++)
		{
			grid[i][j] = false;
		}
	}
	for (let i = 0; i < template.initialPattern.length; i++)
	{
		let x = template.initialPattern[i].x;
		let y = template.initialPattern[i].y;
		let alive = template.initialPattern[i].alive;
		grid[y][x] = alive;
	}
}).catch((e) => console.error(e));

/*grid[44][40] = true;
grid[44][41] = true;
grid[43][41] = true;
grid[42][41] = true;
grid[42][42] = true;
grid[41][42] = true;
grid[41][43] = true;
draw();*/
function start()
{
	timer = setInterval(function() { deltaTime = performance.now() - time; time = performance.now(); draw(); updateGrid(); }, 1000 / fps);/*
	window.onresize = (event) =>
	{
		table.width = window.innerWidth;
		table.height = window.innerHeight;
	};*/
}
function tableClick(event)
{
	console.log(event.offsetX + "; " + event.offsetY);
	let y = Math.trunc(event.offsetY / offset);
	let x = Math.trunc(event.offsetX / offset);
	grid[y][x] = !grid[y][x];
	draw();
}
function keysOff(event)
{
	console.log("off" + event.code + " " + event.keyCode);
	if (event.keyCode == 32)
	{
		start();
	}
	if (event.keyCode == 39)
	{
		updateGrid();
		draw();
	}
}
function draw()
{
	ctx.reset();
	for (let j = 0; j < table.height; j += offset)
	{
		for (let k = 0; k < table.width; k += offset)
		{
			ctx.beginPath();
			//ctx.moveTo(k, j);
			//ctx.lineTo(k + offset, j);
			//ctx.moveTo(k, j);
			//ctx.lineTo(k, j + offset);
			//ctx.stroke();
			let y = Math.trunc(j / offset);
			let x = Math.trunc(k / offset);
			if (y < grid.length && x < grid[y].length && grid[y][x] == true)
			{
				ctx.fillRect(k, j, offset, offset);
			}
		}
	}
}

function updateGrid()
{
	let temp = new Array(grid.length);
	for (var i = 0; i < temp.length; i++)
	{
		temp[i] = new Array(grid[i].length);
		for (let j = 0; j < temp[i].length; j++)
		{
			temp[i][j] = grid[i][j];
		}
	}
	for (let j = 0; j < grid.length; j++)
	{
		for (let k = 0; k < grid[j].length; k++)
		{
			let count = getNeighborsCount(k, j);
			if (grid[j][k] == true)
			{
				if (count < 2)
				{
					temp[j][k] = false;
				}
				else if (count == 2 || count == 3)
				{
					temp[j][k] = true;
				}
				else if (count > 3)
				{
					temp[j][k] = false;
				}
			}
			else
			{
				if (count == 3)
				{
					temp[j][k] = true;
				}
			}
		}
	}
	grid = temp;
}

function getNeighborsCount(x, y)
{
	let count = 0;
	
	if (x > 0) //left
	{
		if (grid[y][x - 1] == true)
		{
			count++;
		}
		if (y > 0)
		{
			if (grid[y - 1][x - 1] == true)
			{
				count++;
			}
		}
		if (y < grid.length - 1)
		{
			if (grid[y + 1][x - 1] == true)
			{
				count++;
			}
		}
	}
	if (x < grid[y].length - 1) //right
	{
		if (grid[y][x + 1] == true)
		{
			count++;
		}
		if (y > 0)
		{
			if (grid[y - 1][x + 1] == true)
			{
				count++;
			}
		}
		if (y < grid.length - 1)
		{
			if (grid[y + 1][x + 1] == true)
			{
				count++;
			}
		}
	}
	if (y > 0) //up
	{
		if (grid[y - 1][x] == true)
		{
			count++;
		}
	}
	if (y < grid.length - 1) //down
	{
		if (grid[y + 1][x] == true)
		{
			count++;
		}
	}
	return count;
}

function inside(x, y, p1X, p1Y, p2X, p2Y)
{
	return (x >= p1X && x <= p2X && y >= p1Y && y <= p2Y);
}

function between(n, a, b)
{
	return (n >= a && n <= b);
}