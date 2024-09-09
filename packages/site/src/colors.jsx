// // lib/initColorDB.js
// import OrbitDB from 'orbit-db';
// import { create } from 'ipfs';

// let colorDb;

// /**
//  * Initializes the Color database on the client side.
//  * @async
//  * @returns {Promise<OrbitDB.Docstore>} The initialized color database.
//  * @throws {Error} If there is an error while creating the IPFS instance.
//  */
// export async function initColorDB() {
//   if (colorDb) return colorDb; // Return existing instance if already initialized

//   // Create the IPFS instance
//   const ipfs = await create({
//     config: {
//       Addresses: {
//         Swarm: [
//           '/ip4/0.0.0.0/tcp/4004',
//           '/ip4/0.0.0.0/tcp/4007/ws'
//         ],
//         API: '/ip4/127.0.0.1/tcp/5003',
//         Gateway: '/ip4/127.0.0.1/tcp/9092',
//       },
//     },
//     EXPERIMENTAL: {
//       pubsub: true,
//     },
//   });

//   // Create the OrbitDB instance
//   const orbitdb = await OrbitDB.createInstance(ipfs);

//   // Define options for the color database
//   const options = {
//     accessController: {
//       type: 'orbitdb',
//       options: {
//         write: ['*'],
//       },
//     },
//   };

//   // Initialize the color database
//   colorDb = await orbitdb.docstore('colors', options);
//   await colorDb.load();

//   console.log('Colors Store initialized');
//   return colorDb;
// }
// import IPFS from 'ipfs-core';
// import OrbitDB from 'orbit-db';

// let ipfs;
// let orbitdb;

// // Initialize IPFS and OrbitDB
// const initOrbitDB = async () => {
//   ipfs = await IPFS.create();
//   orbitdb = await OrbitDB.createInstance(ipfs);
  
//   return orbitdb
// };
// export { initOrbitDB};
