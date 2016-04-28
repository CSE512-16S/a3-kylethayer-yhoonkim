//Code for Self-Organizing Maps

//constructor for Neuron
function neuron(dims) {
	//properties
	this.weights = new Array(dims);
	
	//fill in properties
	for(var i = 0; i < this.weights.length; i++){
		this.weights[i] = 0;
	}
	
	//methods
	this.setWeights = function(newWeights){
		this.updateWeights(newWeights, 1);
	};
	
	this.updateWeights = function(newWeights, fraction){
		for(var i = 0; i < this.weights.length; i++){
			this.weights[i] = this.weights[i] * (1-fraction) + newWeights[i]*fraction;
		}
	};
	
	this.calcDistance = function(testWeights){
		var distsq = 0;
		for(var i = 0; i < this.weights.length; i++){
			var temp = this.weights[i] - testWeights[i];
			distsq += temp * temp;
		}
		var dist = Math.sqrt(distsq);
		return dist;
	};
}

function som(width, height, dims) {
	//properties
	this.dims = dims;
	this.neurons = new Array(width);
	
	//fill in properties
	//create neurons
	for(var i = 0; i < width; i++){
		this.neurons[i] = [];
		for(var j = 0; j < height; j++){
			this.neurons[i].push(new neuron(dims));
		}
	}
	
	this.findBMU = function(testWeights) {
		var bestDist;
		var bestNueronCoords;
		for(var i = 0; i < this.neurons.length; i++){
			for(var j = 0; j < this.neurons[i].length; j++){
				var currentDist = this.neurons[i][j].calcDistance(testWeights);
				if( typeof bestDist === "undefined" || currentDist < bestDist){
					bestDist = currentDist;
					bestNueronCoords = {x: i, y: j};
				}
			}
		}
		return bestNueronCoords;
	};
	
	// Finds all neurons at a distance "dist" from the location "centerLocation". Neurons
	// that are either closer or further are ignored.
	this.findNeighborhoodRing = function(centerLocation, dist){
		var width = this.neurons.length;
		var height = this.neurons[0].length;
		var xCoords = [centerLocation.x - dist, centerLocation.x + dist];
		var yCoords = [centerLocation.y - dist, centerLocation.y + dist];
		var coordsLength = 2;
		if(dist == 0){
			coordsLength = 1;
		}
		
		var neurons = [];
		//top / bottom
		for(var x = xCoords[0]; x <= xCoords[1]; x++){
			for(var j = 0; j < coordsLength; j++){
				var y = yCoords[j];
				if(x >= 0 && x < width && y >= 0 && y < height){
					neurons.push(this.neurons[x][y]);
				}
			}
		}
		
		//left / right (leaving out the corners that were part of top/bottom)
		for(var y = yCoords[0] + 1; y <= yCoords[1] - 1; y++){
			for(var j = 0; j < coordsLength; j++){
				var x = xCoords[j];
				if(x >= 0 && x < width && y >= 0 && y < height){
					neurons.push(this.neurons[x][y]);
				}
			}
		}

		return neurons;
	};
	
	this.train = function(trainWeights, iterations){
		//initialize neurons to trainWeights
		var width = this.neurons.length;
		var height = this.neurons[0].length;
		for(var i = 0; i < width; i++){
			for(var j = 0; j < height; j++){
				var index = i * width + height;
				this.neurons[i][j].setWeights(trainWeights[index % trainWeights.length]);
			}
		}
		
		
		var maxNeighborhoodSize = Math.max(this.neurons.length, this.neurons[0].length) / 2;
		//var minNeighborhoodSize = 1.2;
		var minNeighborhoodSize = .9;
		var neighborConst = Math.log(maxNeighborhoodSize / minNeighborhoodSize) / Math.log(2);
		
		//go through data in order (assume it was randomized first)
		for(var i = 0; i < iterations; i++){
			var neighborhoodSize = (maxNeighborhoodSize * Math.pow(2, -i * neighborConst / iterations)); 
			var iterationFraction = i * 1.0 / iterations;
			this.somTrainStep(trainWeights[i % trainWeights.length], neighborhoodSize, iterationFraction);
		}
	};
        
    this.somTrainStep = function(trainWeight, neighborhoodSize, iterationFraction){
		var bmuCoords = this.findBMU(trainWeight);
		for(var i = 0; i < neighborhoodSize; i++){
			var neighborNodes = this.findNeighborhoodRing(bmuCoords, i);
			var alpha = (.5*Math.pow(2, - iterationFraction *6.0 ) * Math.pow(2, - i*i / neighborhoodSize / neighborhoodSize));
            for(var node in neighborNodes) {
                neighborNodes[node].updateWeights(trainWeight, alpha)
			}
		}
	}
}