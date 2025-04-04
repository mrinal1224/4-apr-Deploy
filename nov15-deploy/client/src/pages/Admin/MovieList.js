import React, { useEffect, useState } from "react";
import MovieForm from "./MovieForm";
import DeleteMovieModal from "./DeleteMovieModal";
import { ShowLoading, HideLoading } from "../../redux/loaderSlice";
import { getAllMovies } from "../../api/movies";
import { useDispatch } from "react-redux";
import { Table, Button } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import moment from "moment";

function MovieList() {
  const FakeMovies = [
    {
      key: "1",
      poster: "Image1",
      title: "Moana 2",
      description:
        "Moana 2 is an upcoming American 3D computer-animated musical fantasy ",
      duration: 120,
      genre: "Animation",
      language: "English",
      releaseDate: "2024-12-01",
    },
    {
      key: "2",
      poster: "Image2",
      title: "Pushpa 2",
      description:
        "Pushpa 2 is an upcoming Indian Telugu-language action thriller film ",
      duration: 120,
      genre: "Action",
      language: "Telugu",
      releaseDate: "2024-12-05",
    },
  ];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [formType, setFormType] = useState("add");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const dispatch = useDispatch();

  const tableHeadings = [
    {
      title: "Poster",
      dataIndex: "poster",

      render: (text, data) => {
        return (
          <img
            src={data.poster}
            height="115"
            width="75"
            style={{ objectFit: "cover" }}
          />
        );
      },
    },
    { title: "Movie Name", dataIndex: "title" },
    { title: "Description", dataIndex: "description" },
    {
      title: "Duration",
      dataIndex: "duration",
      render: (text) => `${text} Mins`,
    },
    { title: "Genre", dataIndex: "genre" },
    { title: "Language", dataIndex: "language" },
    {
      title: "Release Date",
      dataIndex: "releaseDate",
      render: (text, data) => {
        return moment(data.releaseDate).format("MM-DD-YYYY");
      },
    },
    {
      title: "Action",
      render: (text, data) => {
        return (
          <div>
            <Button
              onClick={() => {
                setIsModalOpen(true);
                setSelectedMovie(data);
                setFormType("edit");
              }}
            >
              <EditOutlined />
            </Button>
            <Button
              onClick={() => {
                setIsDeleteModalOpen(true);
                setSelectedMovie(data);
              }}
            >
              <DeleteOutlined />
            </Button>
          </div>
        );
      },
    },
  ];

  const getData = async () => {
    dispatch(ShowLoading()); // loading to true
    const response = await getAllMovies();
    const allMovies = response.data;
    setMovies(
      allMovies.map(function (item) {
        return { ...item, key: `movie${item._id}` };
      })
    );
    dispatch(HideLoading()); // loading to false
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <>
      <div className="d-flex justify-content-end">
        <Button
          onClick={() => {
            setIsModalOpen(true);
            setFormType("add");
          }}
        >
          Add Movie
        </Button>
      </div>
      <Table dataSource={movies} columns={tableHeadings} />
      {isModalOpen && (
        <MovieForm
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          selectedMovie={selectedMovie}
          setSelectedMovie={setSelectedMovie}
          formType={formType}
          getData={getData}
        />
      )}
      {isDeleteModalOpen && (
        <DeleteMovieModal
          isDeleteModalOpen={isDeleteModalOpen}
          setIsDeleteModalOpen={setIsDeleteModalOpen}
          selectedMovie={selectedMovie}
          setSelectedMovie={setSelectedMovie}
          getData={getData}
        />
      )}
    </>
  );
}

export default MovieList;
