function sigmoid(value, activationResponse) {
  return 1 / (1 + Math.exp(-value / activationResponse));
}

function Neuron(numInputs) {
  this.weights = new Array(numInputs + 1);
  for (let i = 0; i <= numInputs; i++) {
    this.weights[i] = Math.random() * 2 - 1;
  }
  this.update = (inputs, bias, activationResponse) => {
    let sum = 0;
    for (let i = 0; i < inputs.length; i++) {
      sum += inputs[i] * this.weights[i];
    }
    sum += bias * this.weights[this.weights.length - 1];
    return sigmoid(sum, activationResponse);
  };
}

function Layer(numInputs, numNeurons) {
  this.neurons = new Array(numNeurons);
  for (let i = 0; i < numNeurons; i++) {
    this.neurons[i] = new Neuron(numInputs);
  }
  this.update = (inputs, bias, activationResponse) => {
    const output = new Array(numNeurons);
    for (let i = 0; i < numNeurons; i++) {
      output[i] = this.neurons[i].update(inputs, bias, activationResponse);
    }
    return output;
  };
}

function NeuralNet(numInputs, numOutputs) {
  this.bias = -1;
  this.activationResponse = 1;
  const layers = [
    new Layer(numInputs, numOutputs),
    new Layer(numOutputs, numOutputs)
  ];
  this.update = inputs => {
    let output = inputs.slice(0);
    for (const layer of layers) {
      output = layer.update(output, this.bias, this.activationResponse);
    }
    return output;
  };
  this.getWeights = () => {
    let output = [];
    for (let i = 0; i < layers.length; i++) {
      const layer = layers[i];
      for (let j = 0; j < layer.neurons.length; j++) {
        const neuron = layer.neurons[j];
        output = output.concat(neuron.weights);
      }
    }
    return output;
  };
  this.setWeights = weights => {
    let count = 0;
    for (let i = 0; i < layers.length; i++) {
      const layer = layers[i];
      for (let j = 0; j < layer.neurons.length; j++) {
        const neuron = layer.neurons[j];
        for (let k = 0; k < neuron.weights.length; k++) {
          neuron.weights[k] = weights[count];
          count++;
        }
      }
    }
  };
}
