import * as React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';
import NotReadChat from './NotReadChat';
import { useNavigate } from 'react-router-dom';

export default function AlignItemsList({ list, dateList }) {

    const navigate = useNavigate();

    const onClick = (one) => {

        navigate('/ChattingPage', {
            state: {
                audience: one.id,
                name: one.name,
                roomId: one.roomId
            }
        });
    }

    return (
        <Box sx={{
            width: '100%',
            width: 470,
            maxWidth: 470,
            backgroundColor: '#fcfcfc',

            scrollMarginTop: '40px',
            height: "315px",
            overflowY: 'auto', // 스크롤 적용
            scrollbarWidth: 'thin', // 스크롤바 스타일 조절
            '&::-webkit-scrollbar': {
                width: '6px',
            },
            '&::-webkit-scrollbar-thumb': {
                background: '#888',
                borderRadius: '3px',
            },
        }}
        >
            {list && list.map((one, index) => (
                <div onClick={() => onClick(one)}>
                    {/* 한명한명 */}
                    <ListItem alignItems="flex-start" sx={{ mt: -1.5, mb: -2, padding: 'auto', color: 'black', }}>
                        {/* 프로필 */}
                        <ListItemAvatar>
                            <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                        </ListItemAvatar>

                        {/* 이름,내용,날짜 */}
                        <ListItemText
                            primary={one.name}
                            secondary={
                                <React.Fragment>
                                    <Typography
                                        sx={{ display: 'inline', }}
                                        component="span"
                                        variant="body2"
                                        color="gray">
                                        {one.chatList.content}
                                        <Typography align='right' sx={{ fontSize: 12, color: 'gray' }} >
                                            {dateList[index]}
                                        </Typography>
                                    </Typography>
                                </React.Fragment>
                            }
                        />
                        {/* 안읽은 채팅 보여주는 아이콘 */}
                        <Box sx={{ marginTop: "17px", marginLeft: "415px", position: "absolute" }}>
                            {one.notReadChat !== 0 && (
                                <NotReadChat num={one.notReadChat} sx={{ position: "absolute", top: 0, right: 0 }} />
                            )}
                        </Box>
                    </ListItem>
                </div>
            ))}
        </Box>
    );
}
