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

    let perception: any =  await fetch('./data/detic:image:for3d.json');
    perception = await perception.json();

    const indexedLabels: { [label: string]: { values: number[], timestamps: number[] } } = {};
    perception.forEach( (entry: any) => {

        const currentTimestamp: number = parseInt(entry.timestamp.split('-')[0]);

        const detectedObjects: { [label:string]: number } = {};
        entry.objects.forEach( (object: any) => {
            detectedObjects[object.label] = object.confidence;
        });

        Object.keys( detectedObjects ).forEach( (key: string) => {

            if( !(key in indexedLabels) ){
                indexedLabels[key] = { values: [], timestamps: [] };
            }
            indexedLabels[key].values.push( detectedObjects[key] );
            indexedLabels[key].timestamps.push( currentTimestamp );
        });

    })

    const parsedData: any[] = [];
    const maxCount = Object.values(indexedLabels).reduce( (a, b) => {
        if( a < b.timestamps.length ) return b.timestamps.length
        return a;
    }, 0)
    Object.keys( indexedLabels ).forEach( (key: string) => {
        parsedData.push(
            { 
                name: key, 
                values: indexedLabels[key].values, 
                timestamps: indexedLabels[key].timestamps, 
                confidence: indexedLabels[key].values.reduce((a, b) => a + b) / indexedLabels[key].values.length, 
                coverage: indexedLabels[key].timestamps.length/maxCount
            }
        )
    });
 
    console.log(parsedData);

    // synthetic data
    // const data =  
    // { name: 'actions', 
    //     labels: [
    //         { name: 'tortilla', values: Array.from({length: 200}, () => (Math.random())), timestamps: Array.from(Array(200).keys()), confidence: Math.random(), coverage: Math.random() },
    //         { name: 'knife'   , values: Array.from({length: 200}, () => (Math.random())), timestamps: Array.from(Array(200).keys()), confidence: Math.random(), coverage: Math.random() },
    //         { name: 'plate'   , values: Array.from({length: 200}, () => (Math.random())), timestamps: Array.from(Array(200).keys()), confidence: Math.random(), coverage: Math.random() },
    //         { name: 'paper towel', values: Array.from({length: 200}, () => (Math.random())), timestamps: Array.from(Array(200).keys()), confidence: Math.random(), coverage: Math.random() },
    //         { name: 'board', values: Array.from({length: 200}, () => (Math.random())), timestamps: Array.from(Array(200).keys()), confidence: Math.random(), coverage: Math.random() },
    //         { name: 'toothpicks', values: Array.from({length: 200}, () => (Math.random())), timestamps: Array.from(Array(200).keys()), confidence: Math.random(), coverage: Math.random() },
    //         { name: 'dental floss', values: Array.from({length: 200}, () => (Math.random())), timestamps: Array.from(Array(200).keys()), confidence: Math.random(), coverage: Math.random() },
    //         { name: 'jam', values: Array.from({length: 200}, () => (Math.random())), timestamps: Array.from(Array(200).keys()), confidence: Math.random(), coverage: Math.random() }
    // ]}

    const data = { name: 'actions', labels: parsedData }

    const mouseover = (timestamp: number | null, index: number | null) => {
        mv.update(  data, timestamp );
    }

    const mouseout = (timestamp: number| null, index: number| null) => {
        mv.update(  data, timestamp );
    }

    const mainDiv: HTMLDivElement = <HTMLDivElement>document.getElementById('main-div');
    const mv = new ModelViewer( mainDiv, { 'mouseover': mouseover, 'mouseout': mouseout } );

    mv.update( data, null );

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