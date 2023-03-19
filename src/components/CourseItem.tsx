import  { FC, useRef, useEffect } from "react";
import { ICourse } from "../types/types";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import Hls from "hls.js";

interface CourseItemProps {
  course: ICourse;
  onClick: (course: ICourse) => void;
}

const CourseItem: FC<CourseItemProps> = ({ course, onClick }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const hls = new Hls();
    if (course.meta.courseVideoPreview.link ) {
      hls.loadSource(course.meta.courseVideoPreview.link);
      hls.attachMedia(video);
    }
      function handleMouseOver() {
        video.muted = true;
        video.play();
      }

      function handleMouseOut() {
        video.muted = false;
        video.pause();
      }

      video.addEventListener("mouseover", handleMouseOver);
      video.addEventListener("mouseout", handleMouseOut);

      return () => {
        hls.destroy();
        video.removeEventListener("mouseover", handleMouseOver);
        video.removeEventListener("mouseout", handleMouseOut);
      
    }
  
  }, [course.meta.courseVideoPreview])

  function Rating({ rating }: { rating: number }) {
  const filledStars = '★'.repeat(Math.round(rating));
  const emptyStars = '☆'.repeat(5 - Math.round(rating));
  const ratingText = `${filledStars}${emptyStars} (${rating})`;
  return <Typography variant="body1" gutterBottom>{ratingText}</Typography>;
}

  return (
    <Card style={{ maxWidth: "345px", margin: "0 auto" }} className="card">
      <CardMedia
        style={{ height: "140px", margin: "0 auto " }}
        component="img"
        image={`${course.previewImageLink}/cover.webp`}
        alt=""
      />
      <CardContent style={{ textAlign: "center", paddingBottom: "20px" }}>
        <Typography style={{ fontSize: "1.5rem" }} variant="h5" component="div" gutterBottom>
          {course.title}
        </Typography>
        <Typography style={{ paddingBottom: "10px" }} variant="body1" gutterBottom>
          Lessons count: {course.lessonsCount}
        </Typography>
        <Typography style={{ paddingLeft: "30px", paddingBottom: "10px", textAlign: 'left', fontSize: "1.3rem" }} variant="body1" gutterBottom>
          Skills:
        </Typography>
        <ul style={{ margin: "0", paddingLeft: "45px", textAlign: 'left' }}>
          {course.meta.skills && course.meta.skills.map((skill) => (
            <Typography key={skill} component="li" variant="body2">
              {skill}
            </Typography>
          ))}
        </ul>
        {course.meta.courseVideoPreview && (<video
          style={{ width: "280px", height: "auto", margin: "20px auto" }}
          ref={videoRef}
          controls
        />)}
        <Rating rating={course.rating} />
      </CardContent>
      <CardActions style={{ justifyContent: "center", paddingBottom: "20px" }}>
        <Button variant="contained" onClick={() => onClick(course)}>Open course</Button>
      </CardActions>
    </Card>
  )
};

export default CourseItem;
