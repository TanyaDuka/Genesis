import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ICourse } from "../types/types";
import Loader from "./Loader";
import VideoPlayer from "./VideoPlayer";
import { Button, Card, CardContent, CardMedia, Typography } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type CourseItemPageParams = {
  id: string;
};

const LessonPage = () => {
  const [course, setCourse] = useState<ICourse | null>(null);
  const params = useParams<CourseItemPageParams>();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedId, setSelectedId] = useState("");

  let TOKEN = localStorage.getItem("TOKEN");

  useEffect(() => {
    setIsLoading(true);

    axios
      .get<ICourse>(
        "https://api.wisey.app/api/v1/core/preview-courses/" + params.id,
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      )
      .then((response) => {
        setCourse(response.data)
        if (response.data?.lessons) {
          setSelectedId(response.data.lessons[0].id || "");
        }
      })
      .catch((error) => {
        toast.error('Помилка запиту до сервера!');
        console.log(error)
      }
      )
      .finally(() => {
        setIsLoading(false);
      });
  }, [params.id]);

  const handleClick = (id: any) => {
    setSelectedId(id !== selectedId ? id : null);
  };

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="lessonContainer">
          <div className="lessonContent">
            <Link to="/courses" style={{ "display": "flex", "alignItems": "center", "paddingBottom": "10px", "marginRight": "10px" }}>
              <ArrowBack />
              <Typography variant="h6" component="h4">Повернутись до списку курсів</Typography>
            </Link>
            <Typography variant="h4" component="h1" gutterBottom>
              {course?.title}
            </Typography>
            <Typography variant="body1" gutterBottom>
              {course?.description}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Lessons count: {course?.lessonsCount}
            </Typography>
            <CardContent>
              <div className="lessonBlock">
                {course?.lessons?.map((lesson) => (
                  <Card key={lesson.id} sx={{ my: 1 }}>
                    <CardMedia
                      component="img"
                      height="140"
                      image={`${lesson.previewImageLink}/lesson-${lesson.order}.webp`}
                      alt="Фото уроку"
                    />
                    <CardContent>
                      <Typography variant="h6" component="h2">
                        {lesson.title}
                      </Typography>
                      <div>
                        {lesson.status === "unlocked" ? (
                          <Button onClick={() => handleClick(lesson.id)}>
                            Переглянути відео
                          </Button>
                        ) : (
                          <Button disabled>Відео недоступно</Button>
                        )}
                      </div>
                      {selectedId === lesson.id && (
                        <VideoPlayer link={lesson.link} />
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </div>
        </div>
      )}
    </div>
  )
};

export default LessonPage;
