import { ModelViewer } from '../src/chart/ModelViewer.model'

const main = async () => {

      // synthetic data
      const data =  
      { name: 'actions', 
          labels: [
              { name: 'tortilla', values: Array.from({length: 200}, () => (Math.random())), confidence: Math.random(), coverage: Math.random() },
              { name: 'knife', values: Array.from({length: 200}, () => (Math.random())), confidence: Math.random(), coverage: Math.random() },
              { name: 'plate', values: Array.from({length: 200}, () => (Math.random())), confidence: Math.random(), coverage: Math.random() },
              { name: 'paper towel', values: Array.from({length: 200}, () => (Math.random())), confidence: Math.random(), coverage: Math.random() },
              { name: 'board', values: Array.from({length: 200}, () => (Math.random())), confidence: Math.random(), coverage: Math.random() },
              { name: 'toothpicks', values: Array.from({length: 200}, () => (Math.random())), confidence: Math.random(), coverage: Math.random() },
              { name: 'dental floss', values: Array.from({length: 200}, () => (Math.random())), confidence: Math.random(), coverage: Math.random() },
              { name: 'jam', values: Array.from({length: 200}, () => (Math.random())), confidence: Math.random(), coverage: Math.random() }
      ]}
  


    const mouseover = (index: number) => {
        mv.update(  data, index, [0, 180000] )
    }

    const mouseout = (index: number) => {
        mv.update(  data, index, [0, 180000] )
    }

    const mainDiv: HTMLDivElement = <HTMLDivElement>document.getElementById('main-div');
    const mv = new ModelViewer( mainDiv, { 'mouseover': mouseover, 'mouseout': mouseout } );

    mv.update( data, null, [0, 180000] );

}

main();