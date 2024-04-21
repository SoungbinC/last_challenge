import { useQuery } from "react-query"
import styled from "styled-components"
import { motion, AnimatePresence, useScroll } from "framer-motion"
import {
    getTv_On_The_Air,
    getTv_Top_Rated,
    getTv_Today,
    IGetTvResult,
} from "../api"
import { makeImagePath } from "../utils"
import { useState } from "react"
import { PathMatch, useMatch, useNavigate } from "react-router-dom"

const Wrapper = styled.div`
    background: black;
    padding-bottom: 200px;
`

const Loader = styled.div`
    height: 20vh;
    display: flex;
    justify-content: center;
    align-items: center;
`

const Banner = styled.div<{ bgphoto: string }>`
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 60px;
    background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
        url(${(props) => props.bgphoto});
    background-size: cover;
`

const Title = styled.h2`
    font-size: 68px;
    margin-bottom: 20px;
`

const SlideTitle = styled.h3`
    font-size: 30px;
    margin-bottom: 20px;
`
const SliderContainer = styled.div`
    position: relative;

    &:first-child {
        top: -100px;
    }
`
const Slider = styled.div`
    position: relative;
    margin-bottom: 240px;
`

const Row = styled(motion.div)`
    display: grid;
    gap: 5px;
    grid-template-columns: repeat(6, 1fr);
    position: absolute;
    width: 100%;
`

const Box = styled(motion.div)<{ bgphoto: string }>`
    background-color: white;
    background-image: url(${(props) => props.bgphoto});
    background-size: cover;
    background-position: center center;
    height: 200px;
    font-size: 66px;
    cursor: pointer;
    &:first-child {
        transform-origin: center left;
    }
    &:last-child {
        transform-origin: center right;
    }
`
const Overlay = styled(motion.div)`
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    opacity: 0;
`
const BigTv = styled(motion.div)`
    position: absolute;
    width: 40vw;
    height: 80vh;
    left: 0;
    right: 0;
    margin: 0 auto;
    border-radius: 15px;
    overflow: hidden;
    background-color: ${(props) => props.theme.black.lighter};
`

const BigCover = styled.div`
    width: 100%;
    background-size: cover;
    background-position: center center;
    height: 400px;
`

const BigTitle = styled.h3`
    color: ${(props) => props.theme.white.lighter};
    padding: 20px;
    font-size: 46px;
    position: relative;
    top: -80px;
`

const BigVote = styled.p`
    padding: 20px;
    position: relative;
    top: -80px;
    color: ${(props) => props.theme.white.lighter};
`

const rowVariants = {
    hidden: {
        x: window.outerWidth + 5,
    },
    visible: {
        x: 0,
    },
    exit: {
        x: -window.outerWidth - 5,
    },
}

const boxVariants = {
    normal: {
        scale: 1,
    },
    hover: {
        scale: 1.3,
        y: -80,
        transition: {
            delay: 0.5,
            duaration: 0.1,
            type: "tween",
        },
    },
}
const Info = styled(motion.div)`
    padding: 10px;
    background-color: ${(props) => props.theme.black.lighter};
    opacity: 0;
    position: absolute;
    width: 100%;
    bottom: 0;
    h4 {
        text-align: center;
        font-size: 18px;
    }
`

const infoVariants = {
    hover: {
        opacity: 1,
        transition: {
            delay: 0.5,

            duaration: 0.1,
            type: "tween",
        },
    },
}

const offset = 6
function Tv() {
    const navigate = useNavigate()
    const bigTvMatch: PathMatch<string> | null = useMatch("/tv/:tvId")

    const { scrollY } = useScroll()

    const { data: Tv_Today, isLoading } = useQuery<IGetTvResult>(
        ["tv", "Tv_Today"],
        getTv_Today
    )
    const { data: Tv_Top_Rating } = useQuery<IGetTvResult>(
        ["tv", "Tv_Top_Rating"],
        getTv_Top_Rated
    )

    const { data: Tv_On_The_Air } = useQuery<IGetTvResult>(
        ["tv", " Tv_On_The_Air"],
        getTv_On_The_Air
    )

    const [index, setIndex] = useState(0)
    const [leaving, setLeaving] = useState(false)
    const Tv_Today_incraseIndex = () => {
        if (Tv_Today) {
            if (leaving) return
            toggleLeaving()
            const totalTvs = Tv_Today.results.length - 1
            const maxIndex = Math.floor(totalTvs / offset) - 1
            setIndex((prev) => (prev === maxIndex ? 0 : prev + 1))
        }
    }
    const toggleLeaving = () => setLeaving((prev) => !prev)
    const onBoxClicked = (tvId: number) => {
        navigate(`/tv/${tvId}`)
    }
    const onOverlayClick = () => navigate("/tv")
    const clickedTv =
        bigTvMatch?.params.tvId &&
        (Tv_Today?.results.find((Tv) => Tv.id === +bigTvMatch.params.tvId!) ||
            Tv_Top_Rating?.results.find(
                (Tv) => Tv.id === +bigTvMatch.params.tvId!
            ) ||
            Tv_On_The_Air?.results.find(
                (Tv) => Tv.id === +bigTvMatch.params.tvId!
            ))

    return (
        <Wrapper>
            {isLoading ? (
                <Loader>Loading...</Loader>
            ) : (
                <>
                    <Banner
                        onClick={Tv_Today_incraseIndex}
                        bgphoto={makeImagePath(
                            Tv_Today?.results[0].backdrop_path || ""
                        )}
                    >
                        <Title>{Tv_Today?.results[0].name}</Title>
                    </Banner>
                    <SliderContainer>
                        <Slider>
                            <SlideTitle>Now Playing!!</SlideTitle>
                            <AnimatePresence
                                initial={false}
                                onExitComplete={toggleLeaving}
                            >
                                <Row
                                    variants={rowVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    transition={{ type: "tween", duration: 1 }}
                                    key={index}
                                >
                                    {Tv_Today?.results
                                        .slice(1)
                                        .slice(
                                            offset * index,
                                            offset * index + offset
                                        )
                                        .map((Tv) => (
                                            <Box
                                                layoutId={Tv.id + ""}
                                                key={Tv.id}
                                                whileHover="hover"
                                                initial="normal"
                                                variants={boxVariants}
                                                transition={{ type: "tween" }}
                                                bgphoto={makeImagePath(
                                                    Tv.backdrop_path,
                                                    "w500"
                                                )}
                                                onClick={() =>
                                                    onBoxClicked(Tv.id)
                                                }
                                            >
                                                <Info variants={infoVariants}>
                                                    <h4>{Tv.name}</h4>
                                                </Info>
                                            </Box>
                                        ))}
                                </Row>
                            </AnimatePresence>
                        </Slider>
                        <Slider>
                            <SlideTitle>Top Rating!!</SlideTitle>
                            <AnimatePresence
                                initial={false}
                                onExitComplete={toggleLeaving}
                            >
                                <Row
                                    variants={rowVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    transition={{ type: "tween", duration: 1 }}
                                    key={index}
                                >
                                    {Tv_Top_Rating?.results
                                        .slice(1)
                                        .slice(
                                            offset * index,
                                            offset * index + offset
                                        )
                                        .map((Tv) => (
                                            <Box
                                                layoutId={Tv.id + ""}
                                                key={Tv.id}
                                                whileHover="hover"
                                                initial="normal"
                                                variants={boxVariants}
                                                transition={{ type: "tween" }}
                                                bgphoto={makeImagePath(
                                                    Tv.backdrop_path,
                                                    "w500"
                                                )}
                                                onClick={() =>
                                                    onBoxClicked(Tv.id)
                                                }
                                            >
                                                <Info variants={infoVariants}>
                                                    <h4>{Tv.name}</h4>
                                                </Info>
                                            </Box>
                                        ))}
                                </Row>
                            </AnimatePresence>
                        </Slider>
                        <Slider>
                            <SlideTitle> Tv_On_The_Air!!</SlideTitle>
                            <AnimatePresence
                                initial={false}
                                onExitComplete={toggleLeaving}
                            >
                                <Row
                                    variants={rowVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    transition={{ type: "tween", duration: 1 }}
                                    key={index}
                                >
                                    {Tv_On_The_Air?.results
                                        .slice(1)
                                        .slice(
                                            offset * index,
                                            offset * index + offset
                                        )
                                        .map((Tv) => (
                                            <Box
                                                layoutId={Tv.id + ""}
                                                key={Tv.id}
                                                whileHover="hover"
                                                initial="normal"
                                                variants={boxVariants}
                                                transition={{ type: "tween" }}
                                                bgphoto={makeImagePath(
                                                    Tv.backdrop_path,
                                                    "w500"
                                                )}
                                                onClick={() =>
                                                    onBoxClicked(Tv.id)
                                                }
                                            >
                                                <Info variants={infoVariants}>
                                                    <h4>{Tv.name}</h4>
                                                </Info>
                                            </Box>
                                        ))}
                                </Row>
                            </AnimatePresence>
                        </Slider>
                    </SliderContainer>

                    <AnimatePresence>
                        {bigTvMatch ? (
                            <>
                                <Overlay
                                    onClick={onOverlayClick}
                                    exit={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                />
                                <BigTv
                                    style={{ top: scrollY.get() + 100 }}
                                    layoutId={bigTvMatch.params.tvId}
                                >
                                    {clickedTv && (
                                        <>
                                            <BigCover
                                                style={{
                                                    backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                                                        clickedTv.backdrop_path,
                                                        "w500"
                                                    )})`,
                                                }}
                                            />
                                            <BigTitle>
                                                {clickedTv.name}
                                            </BigTitle>

                                            <BigVote>
                                                Vote Average:{" "}
                                                {clickedTv.vote_average.toFixed(
                                                    2
                                                )}
                                            </BigVote>
                                        </>
                                    )}
                                </BigTv>
                            </>
                        ) : null}
                    </AnimatePresence>
                </>
            )}
        </Wrapper>
    )
}
export default Tv
