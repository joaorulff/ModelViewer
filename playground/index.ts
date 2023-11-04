import { ModelViewer } from '../src/chart/ModelViewer.model'
import { TemporalModelViewer } from '../src/chart/TemporalModelViewer.model';
import { ContinuousModelViewer } from '../src/chart/ContinuousModelViewer.model';


// const continuousModelViewer = async () => {

//     let reasoning: any =  await fetch('./data/reasoning:check_status.json');
//     reasoning = await reasoning.json();

//     // let memory: any =  await fetch('./data/detic:memory.json');
//     // memory = await memory.json();
    
//     // const testRecipes: string[] = ['recipe1', 'recipe2', 'recipe3', 'recipe4'];
//     // const recipes: { [recipe: string | number ]: { y: number, x: number }[] } = {};

//     // testRecipes.forEach( (recipe: string) => {
//     //     recipes[recipe] = []; 
//     //     let currentStep: number = 0;
//     //     for( let i = 0; i < 100; i++ ){
//     //         const random: number = Math.floor(Math.random()*100)%12;
//     //         if( random === 0){
//     //             currentStep++;
//     //         }
//     //         recipes[recipe].push( { y: currentStep, x: i })
//     //     }
//     // });


    

//     const tasks: { [task: string ]: { step: number, timestamp: number, error: boolean }[] } = {};
//     reasoning.forEach( (row: any) => {

//         const currentTimestamp: number = parseInt( row.timestamp.split('-')[0] );
//         row.active_tasks.forEach( (activeTask: any) => {

//             if( ! (activeTask.task_id in tasks) ){
//                 tasks[activeTask.task_id] = [];
//             }

//             tasks[activeTask.task_id].push( {timestamp: currentTimestamp, step: activeTask.step_id, error: activeTask.error_status })

//         })
//     });

//     // console.log(tasks);

//     const mouseover = (timestamp: number) => {
//         cmv.update( tasks, timestamp );
//     }

//     const mouseout = (timestamp: number) => {
//         cmv.update( tasks, null );
//     }

//     const mainDiv: HTMLDivElement = <HTMLDivElement>document.getElementById('main-div');
//     const cmv: ContinuousModelViewer = new ContinuousModelViewer( mainDiv, { 'mouseover': mouseover, 'mouseout': mouseout } ); 

//     cmv.update( tasks, null );
//     // console.log(recipes);
// }

// const temporalModelViewer = async () => {

//     let memory: any =  await fetch('./data/memory.json');
//     memory = await memory.json();

//     const indexedIDs: { [labelName: string]: { [id: number] : { value: string | number, timestamp: number }[] } } = {};
//     memory.forEach( (entry: any) => {

//         const currentTimestamp: number = parseInt( entry.timestamp.split('-')[0] );
//         entry.values.forEach( (object: any) => {

//             if( !(object.label in indexedIDs) ){
//                 indexedIDs[object.label] = {};
//             }

//             if( !(object.id in indexedIDs[object.label] ) ){
//                 indexedIDs[object.label][object.id] = [];
//             }

//             indexedIDs[object.label][object.id].push({ value: object.status, timestamp: currentTimestamp });            
//         })
//     });


//     const mouseover = (timestamp: number) => {
//         tv.update( indexedIDs['bowl'], timestamp );
//     }

//     const mouseout = (timestamp: number) => {
//         tv.update( indexedIDs['bowl'], null );
//     }

//     // temporal viewer
//     const mainDiv: HTMLDivElement = <HTMLDivElement>document.getElementById('main-div');
//     const tv: TemporalModelViewer = new TemporalModelViewer( mainDiv, { 'mouseover': mouseover, 'mouseout': mouseout } );


//     tv.update( indexedIDs['bowl'], null );

//     // setTimeout( () => {

//     //     tv.update( indexedIDs['bowl'], 1698802372577 );

//     // }, 2000



//     // setTimeout( () => {
//     //     console.log( indexedIDs['tortilla'] );
//     //     tv.update( indexedIDs['tortilla'], null );
//     // }, 2000);

// }

const main = async () => {

    // let memory: any =  await fetch('./data/memory.json');
    // memory = await memory.json();

    // // let detic: any = await fetch('./data/detic:image:misc:for3d.json');
    // // detic = await detic.json();

    // // for( let i = 0; i < 20; i++ ){
    // //     console.log(memory[i].timestamp, ' - ', detic[i].timestamp)
    // // }


    // const timestamp: number [] = [+Infinity, -Infinity];
    // memory.forEach( (entry: any) => {
        
    //     const ts: number = parseInt(entry.timestamp.split('-')[0])
        
    //     if(  ts < timestamp[0] ){
    //         timestamp[0] =  ts
    //     }

    //     if( ts > timestamp[1] ){
    //         timestamp[1] =  ts
    //     }

    // })

    // console.log(timestamp[1]- timestamp[0])

    // // getting single IDs
    // const uniqueIDs = get_unique_ids( memory );
    // const indexedIDs = uniqueIDs.reduce( (accum: any, current: any) => {
    //     accum[current] = { values: [], colors: [] };
    //     return accum;
    // }, {});

    // let accumulator = 0;
    // memory.forEach( (entry: any) => {
    //     entry.values.forEach( (object: any) => {

    //         const key: string = `${object.label}-${object.id}`;

    //         if( object.status === 'tracked'){
    //             indexedIDs[key].colors.push('#377eb8');
    //             indexedIDs[key].values.push(0.0);
    //         }else if( object.status === 'outside'){
    //             indexedIDs[key].colors.push('#e41a1c');
    //             indexedIDs[key].values.push(0.0);
    //         }else {
    //             console.log('EXTENDED')
    //             indexedIDs[key].colors.push('#4daf4a');
    //             indexedIDs[key].values.push(0.0);
    //         }                   
    //     })
    //     accumulator += 1;

    //     Object.keys(indexedIDs).forEach( (id: any) => {
    //         if( indexedIDs[id].colors.length < accumulator ){
    //             indexedIDs[id].colors.push('white');
    //             indexedIDs[id].values.push(0.0);
    //         }
    //     });

    // });

    // // formatting the data
    // const labels: { name: string, values: number[], confidence: number, coverage: number, colors?: string[] }[] = [];
    // Object.keys(indexedIDs).forEach( (id: any) => {
    //     if( id.includes('tortilla_package') ){
    //         labels.push({
    //             name: `${id}`,
    //             values: indexedIDs[id].values,
    //             confidence: 0.5,
    //             coverage: 0.5,
    //             colors: indexedIDs[id].colors,
    //         })
    //     }
    // });

      // synthetic data
      const data =  
      { name: 'actions', 
          labels: [
              { name: 'tortilla', values: Array.from({length: 1200}, () => (Math.random())), confidence: Math.random(), coverage: Math.random(), colors: Array.from({length: 1200}, () => ( 'red' )) },
              { name: 'knife', values: Array.from({length: 1200}, () => (Math.random())), confidence: Math.random(), coverage: Math.random()  },
              { name: 'plate', values: Array.from({length: 1200}, () => (Math.random())), confidence: Math.random(), coverage: Math.random() },
            //   { name: 'paper towel', values: Array.from({length: 1200}, () => (Math.random())), confidence: Math.random(), coverage: Math.random() },
            //   { name: 'board', values: Array.from({length: 1200}, () => (Math.random())), confidence: Math.random(), coverage: Math.random() },
            //   { name: 'toothpicks', values: Array.from({length: 1200}, () => (Math.random())), confidence: Math.random(), coverage: Math.random() },
            //   { name: 'dental floss', values: Array.from({length: 1200}, () => (Math.random())), confidence: Math.random(), coverage: Math.random() },
            //   { name: 'jam', values: Array.from({length: 1200}, () => (Math.random())), confidence: Math.random(), coverage: Math.random() }
      ]}


    // // synthetic data
    // const data =  
    // { name: 'actions', 
    //     labels: labels
    // }

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

const get_unique_ids = ( memorystream: any ) => {

    const idSet = new Set<string>();
    memorystream.forEach( (entry: any) => {
        entry.values.forEach( (object: any) => {
            idSet.add(`${object.label}-${object.id}`); 
        })
    });

    return Array.from(idSet.values());
}

main();
// temporalModelViewer();
// continuousModelViewer();