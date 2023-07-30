import {
  faArrowUp,
  faArrowUpFromBracket,
  faHeart,
  faRepeat,
  faShare,
  faBookmark,
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import { useEffect, useState } from "react";

import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShareIcon from "@mui/icons-material/Share";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";

import AutorenewIcon from "@mui/icons-material/Autorenew";
import { useRecoilValue } from "recoil";
import { UserData as UserAtom, loginState } from "../../atoms";
import axios from "axios";

const Wrapper = styled.div`
  width: 100%;
  border-top: 1px solid #767676;
  border-bottom: 1px solid #767676;
  padding: 25px;
`;
const PostOwner = styled.div`
  display: flex;
  margin-bottom: 20px;
  img {
    width: 65px;
    height: 65px;
    border-radius: 100%;
    background-color: #feefea;
    border: none;
    outline: none;
  }
`;
const OwnerInfo = styled.div`
  padding: 10px;
  margin-left: 10px;
  h1 {
    font-weight: 600;
    margin-bottom: 5px;
  }
`;
const PostContent = styled.div`
  h1 {
    font-size: 20px;
    font-weight: 500;
  }
  img {
    width: 100%;
    height: 400px;
    border: 1px solid black;
  }
`;

const Reaction = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  margin-top: 10px;

  > div {
    background-color: inherit;

    border: none;
    width: 23%;
    display: flex;
    align-items: center;
    justify-content: space-around;
    cursor: pointer;
    color: #767676;
    > span {
      margin-left: 10px;
    }
  }
`;
const ReactionButton = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #767676;
`;

const LikeBtn = styled.span`
  display: flex;
  text-align: center;
  justify-content: space-between;
  width: 70px;
  span {
  }
  span:last-child {
    width: 20px;
  }
`;

// Define the type for the props
export interface MainPostProps {
  id: number;
  profile_image?: string;
  image?: string;
  username: string;
  date: string;
  title: string;
  content: string;
  upVote: string;
}

function MainPost(props: MainPostProps) {
  const [liked, setLiked] = useState(false);
  const [marked, setMarked] = useState(false);
  const [upVoteCount, setUpVoteCount] = useState(0);

  const GlobalUserData = useRecoilValue(UserAtom);
  const apiUrl = "http://localhost:3001"; // Change this URL to your actual server URL
  const handleLikeClick = () => {
    setLiked(!liked);

    // Define the request data (start and listn in your case)
    const requestData = {
      postId: props.id,
      userId: GlobalUserData.id,
    };

    axios
      .post(`${apiUrl}/likePost`, requestData)
      .then((response) => {
        // Handle the API response
        const responseData = response.data;
        console.log(response.data);
        if (responseData.message === "OK") {
          // Check if the post was already liked
          if (liked) {
            // Post was already liked, so decrement upVote by 1
            // Update the upVote state to reflect the change
            setUpVoteCount((prevUpVote) => prevUpVote - 1);
          } else {
            // Post was not liked, so increment upVote by 1
            // Update the upVote state to reflect the change
            setUpVoteCount((prevUpVote) => prevUpVote + 1);
          }
        } else {
          console.log("Error liking post:", responseData.message);
        }
      })
      .catch((error) => {
        // Handle any errors
        console.error("Error liking post:", error);
      });
  };

  const handleMarkClick = () => {
    setMarked(!marked);
  };

  const formattedDate = new Date(props.date).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  useEffect(() => {
    const emailArray = props.upVote.split(",");

    if (emailArray.includes(GlobalUserData.id.toString())) {
      setLiked(true);
    }
    setUpVoteCount(emailArray.length - 1);
  }, []);

  return (
    <>
      <Wrapper key={props.id}>
        <PostOwner>
          {/* <img src={`${props.profile_image}`} /> */}
          <img src={`${props.profile_image}`} alt="Image" />

          <OwnerInfo>
            <h1>{props.username}</h1>
            <div>{formattedDate}</div>
          </OwnerInfo>
        </PostOwner>
        <PostContent>
          <h1>{props.title}</h1>
          {props.image && <img src={`${props.image}`} />}
          <p>{props.content}</p>
        </PostContent>
        <Reaction>
          <ReactionButton onClick={handleLikeClick}>
            {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            <LikeBtn>
              <span>좋아요</span>
              <span>{upVoteCount}</span>
            </LikeBtn>
          </ReactionButton>
          <div>
            <AutorenewIcon />
            <span>리포스트</span>
          </div>
          <ReactionButton onClick={handleMarkClick}>
            {marked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
            <span>북마크</span>
          </ReactionButton>
          <div>
            <ShareIcon />
            <span>공유하기</span>
          </div>
        </Reaction>
      </Wrapper>
    </>
  );
}

export default MainPost;
