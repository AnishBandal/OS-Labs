// const Calculator = ({ results, selectedAlgorithms }) => {
//     return (
//       <div className="space-y-4">
//         <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Results</h2>
//         <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4">
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <p className="text-sm text-gray-500 dark:text-gray-400">Algorithm</p>
//               <p className="font-medium">{results.algorithm}</p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-500 dark:text-gray-400">Total Seek Time</p>
//               <p className="font-medium">{results.totalSeekTime}</p>
//             </div>
//           </div>
//         </div>
//         <div>
//           <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Seek Sequence</p>
//           <div className="bg-gray-100 dark:bg-gray-700 rounded p-3 overflow-x-auto">
//             <code className="text-sm">
//               {results.sequence.join(" → ")}
//             </code>
//           </div>
//         </div>
//       </div>
//     );
//   };
  
//   export default Calculator;