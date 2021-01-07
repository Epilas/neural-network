const math = require ('mathjs')

/* export */ const sigmoid = (x) => {
    //return Math.exp(x) / (Math.exp(x) + 1)
    return 1/(1+Math.exp(-x))
}

export class Network {
    constructor(layers) {
        this.sizes = layers;
        this.bias = layers.map((layerSize) => {
            return (
                [...Array(layerSize)].map(() => 
                    math.random()-0.5 
                )
            );
        })
        this.weights = layers.slice(0, -1).map((layerSize, index) => {
            const nextLayerSize = layers[index+1]
            return (
                [...Array(nextLayerSize)].map(() => {
                    return (
                        [...Array(layerSize)].map(w => (math.random()*2)-1)
                    )
                })
            );
        })
    }
  
    feedForward (input) {
        let activations = input;

        //for (let layer of this.weights) {
        for (let i = 0; i < this.weights.length; i++) {
            // eslint-disable-next-line no-loop-func
            activations = this.weights[i].map( (weights,index) => {
                const sum = math.dot(activations, weights)+this.bias[i+1][index]
                return sigmoid(sum)
            })
        }
        return activations
    }
  
    backProp (x, y) {
      const originalCost = this.cost(x, y)
      let gradientVector = []
  
      this.weights.forEach((layer, lIndex) => {
        const dLayer = [];
        layer.forEach((neuron, nIndex) => {
          const dNeuron = []
          neuron.forEach((weight, wIndex) => {
            let original = weight;
            this.weights[lIndex][nIndex][wIndex] += 0.01;
            let newCost = this.cost(x, y);
            let delWeight = (newCost - originalCost) / 0.01;
            dNeuron.push(delWeight)
            this.weights[lIndex][nIndex][wIndex] = original
          })
          dLayer.push(dNeuron)
        })
        gradientVector.push(dLayer);
      })
      gradientVector.forEach((layer, lIndex) => {
        layer.forEach((neuron, nIndex) => {
          neuron.forEach((del, wIndex) => {
            this.weights[lIndex][nIndex][wIndex] -= del;
          })
        })
      })
    };
  
    cost (x, y) {
      const activations = this.feedForward(x);
      const costVector = activations.map((yhat, index) => {
        return ( yhat - y[index] )**2
      })
      return math.sum(costVector);
    }
  
    train ({ input, output, epochs }) {
      for (let n = 0; n < epochs; n++) {
        input.forEach((x, index) => {
          this.backProp(x, output[index]);
        });
      }
      console.log("network has trained")
    }

    predict (x) {
      return this.feedForward(x);
    }
  }
