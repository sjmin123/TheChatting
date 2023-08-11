// import React from 'react';
// import { gql, useSubscription } from '@apollo/client';
// import { useEffect } from 'react';


// const MESSAGE_ADDED = gql`
// subscription MessageAdded {
//   messageAdded {
//     createdAt
//       content
//       from {
//         id
//         nickname
//       }
//   }
// }
// `;

// export const RealTimeChat = ({ realTimeOnChange }) => {
//   const { data: data2, loading, error } = useSubscription(MESSAGE_ADDED);

//   if (loading || error || !data2) {
//     return null;
//   }
//   console.log(data2.messageAdded);

//   if (data2) {
//     realTimeOnChange(data2.messageAdded);
//     return null;
//   }

//   const { content, from } = data2.messageAdded;

//   // 데이터를 적절히 처리하여 렌더링
//   return (<div>
//     data.messageAdded
//   </div>);
// };