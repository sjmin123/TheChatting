import React from 'react';
import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import { Button } from '@mui/material';

export const ADD_FRIEND = gql`
mutation($id: String!){
  addFriend(id: $id)
}
`;

const AddFriend= ({userId}) => {

    const [add, { data, loading, error }] = useMutation(ADD_FRIEND);
    
    if (loading) {
      return <div>Loading...</div>;
    }
    if (error) {
      return <div>Error:)</div>;
    }
    
    try{
    const onClick = async (e) => {
      e.preventDefault();
      await add({ variables: { id:userId }});
      window.location.reload();
      //모달이었나 alarm이었나 화면 보여주기.
    };
    console.log(data);
    

    return (
         <div style={{ display:'flex', marginRight:'0px'}}>
            <Button variant="contained" onClick={onClick} sx={{height:"30px",marginRight:"5px"
            , borderRadius:"20px", marginTop:"10px",backgroundColor:"#4e586e",'&:hover': {
              backgroundColor: "#3a4050", 
            },}}>
                  친구 추가
            </Button>
        </div>
        );
    }catch(error){
        return <p>Error :(</p>
    }

}

export default AddFriend;