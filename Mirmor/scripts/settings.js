const HABITS = {
    type: "group",
    name: "Chương trình Mirmor",
    children: {
        morning: {
            type: "group",
            name: "Buổi sáng",
            children: {
                get_up: {
                    type: "habit_check",
                    name: "Dậy sớm",
                    required: true,
                    point: 15
                },
                make_bed: {
                    type: "habit_check",
                    name: "Dọn giường",
                    required: true,
                    point: 15
                },
                check_todos: {
                    type: "habit_check",
                    name: "Kiểm tra việc cần làm",
                    required: true,
                    point: 15
                },
                check_news: {
                    type: "habit_check",
                    name: "Kiểm tra tin tức trên <a href='https://news.google.com/' target='_blank'>Google News</a>, <a href='https://feedly.com/' target='_blank'>Feedly</a>",
                    required: true,
                    point: 75
                },
                morning_hygiene: {
                    type: "habit_check",
                    name: "Đánh răng, rửa mặt sáng",
                    required: true,
                    point: 15
                },
                have_breakfast: {
                    type: "habit_check",
                    name: "Ăn sáng",
                    required: true,
                    point: 50
                },
            }
        },
        periodic: {
            type: "group",
            name: "Định kì",
            children: {
                control_plan: {
                    type: "group",
                    name: "Kiểm soát kế hoạch",
                    children: {
                        weekly_plan: {
                            type: "habit_check",
                            name: "Tổng kết tuần qua, lên kế hoạch cho tuần tới",
                            point: 50,
                            required: (arguments) => {
                                return arguments.XDate_function().is_last_day_of.week;
                            }
                        },
                        monthly_plan: {
                            type: "habit_check",
                            name: "Tổng kết tháng qua, lên kế hoạch cho tháng tới",
                            required: (arguments) => {
                                return arguments.XDate_function().is_last_day_of.month;
                            },
                            point: 100
                        },
                        review_Mirmor: {
                            type: "habit_check",
                            name: "Đánh giá tổng thể Mirmor",
                            required: (arguments) => {
                                return arguments.XDate_function().is_last_day_of.month;
                            },
                            point: 100
                        },
                        summer_vacation_plan: {
                            type: "habit_check",
                            name: "Tổng kết năm học qua, lên kế hoạch cho kì nghỉ hè tới",
                            required: (arguments) => {
                                return arguments.XDate_function().is_last_day_of.academic_year;
                            },
                            point: 150
                        },
                        academic_year_plan: {
                            type: "habit_check",
                            name: "Tổng kết kì nghỉ hè qua, lên kế hoạch cho năm học tới",
                            required: (arguments) => {
                                return arguments.XDate_function().is_last_day_of.summer_vacation;
                            },
                            point: 150
                        },
                        annual_plan: {
                            type: "habit_check",
                            name: "Tổng kết năm qua, lên kế hoạch cho năm tới",
                            required: (arguments) => {
                                return arguments.XDate_function().is_last_day_of.year;
                            },
                            point: 150
                        }
                    }
                },
                wash_face_towel: {
                    type: "habit_check",
                    name: "Rửa khăn mặt kĩ và phơi khô",
                    required: (arguments) => {
                        return arguments.XDate_function().is_last_day_of.week;
                    },
                    point: 15
                },
                cut_nails_toes: {
                    type: "habit_check",
                    name: "Cắt móng tay/chân",
                    required: (arguments) => {
                        return arguments.XDate_function().is_last_day_of.week;
                    },
                    point: 15
                },
                beard_trimming: {
                    type: "habit_check",
                    name: "Tỉa râu",
                    required: (arguments) => {
                        return arguments.XDate_function().is_last_day_of.week;
                    },
                    point: 15
                },
                cut_hair: {
                    type: "habit_check",
                    name: "Cắt tóc",
                    required: (arguments) => {
                        return arguments.XDate_function().is_last_day_of.month;
                    },
                    point: 15
                }
            }
        },
        throughout_day: {
            type: "group",
            name: "Trong ngày",
            children: {
                water: {
                    type: "habit_number",
                    name: "Uống nước",
                    required: true,

                    unit: "ml",
                    point_per_value: 0.05,
                    goal_value: 2000,
                },
                eat_lunch: {
                    type: "group",
                    name: "Ăn trưa",
                    children: {
                        vegatable: {
                            type: "habit_check",
                            name: "Rau củ",
                            required: true,
                            point: 50
                        },
                        fruit: {
                            type: "habit_check",
                            name: "Trái cây",
                            required: false,
                            point: 50
                        },
                        seafood: {
                            type: "habit_check",
                            name: "Hải sản",
                            required: false,
                            point: 100
                        },
                        nuts_and_whole_grains: {
                            type: "habit_check",
                            name: "Hạt và ngũ cốc",
                            required: false,
                            point: 50
                        }
                    }
                },
                sport: {
                    type: "habit_number",
                    name: "Thể thao",
                    required: true,

                    unit: "phút",
                    point_per_value: 2,
                    goal_value: 15
                },
                bath: {
                    type: "habit_check",
                    name: "Tắm rửa, gội đầu",
                    required: true,
                    point: 15
                },
                washing_up: {
                    type: "habit_check",
                    name: "Giặt quần áo",
                    required: true,
                    point: 50
                },
                eat_dinner: {
                    type: "group",
                    name: "Ăn tối",
                    children: {
                        vegatable: {
                            type: "habit_check",
                            name: "Rau củ",
                            required: true,
                            point: 50
                        },
                        fruit: {
                            type: "habit_check",
                            name: "Trái cây",
                            required: false,
                            point: 50
                        },
                        seafood: {
                            type: "habit_check",
                            name: "Hải sản",
                            required: false,
                            point: 100
                        },
                        nuts_and_whole_grains: {
                            type: "habit_check",
                            name: "Hạt và ngũ cốc",
                            required: false,
                            point: 50
                        }
                    }
                },
                reading_book: {
                    type: "habit_number",
                    name: "Đọc sách",
                    required: true,

                    unit: "trang",
                    point_per_value: 5,
                    goal_value: 5
                },
                learn_Eng_vocab: {
                    type: "habit_check",
                    name: "Học từ vựng tiếng Anh",
                    required: true,
                    point: 25
                },
                study_for_tomorrow: {
                    type: "habit_check",
                    name: "Học, chuẩn bị bài cho ngày mai",
                    required: true,
                    point: 50
                },
                completed_all_todo: {
                    type: "habit_check",
                    name: "Hoàn thành tất cả việc cần làm",
                    required: true,
                    point: 100
                }
            }
        },
        evening: {
            type: "group",
            name: "Buổi tối",
            children: {
                evening_hygiene: {
                    type: "habit_check",
                    name: "Đánh răng, rửa mặt tối",
                    required: true,
                    point: 15
                },
                no_smartphone_before_sleep: {
                    type: "habit_check",
                    name: "Không sử dụng điện thoại trước khi ngủ 15 phút",
                    required: true,
                    point: 50
                },
                sleep_prepare: {
                    type: "habit_check",
                    name: "Dọn dẹp nơi làm việc, đặt chuông",
                    required: true,
                    point: 15
                },
                sleep_early: {
                    type: "habit_check",
                    name: "Ngủ sớm",
                    required: true,
                    point: 150
                },
                discipline: {
                    type: "habit_check",
                    name: "Đạt tinh thần kỉ luật trong cả ngày",
                    required: true,
                    point: 150
                }
            }
        },
        view_data: {
            type: "habit_ext",
            name: "Xem dữ liệu Mirmor hôm nay",
            extension_id: "view_data"
        },
        midinfo: {
            type: "habit_ext",
            name: "Xem thống kê MID",
            extension_id: "midinfo"
        }
    }
};

const EXTENSIONS = {
    midinfo: {
        name: "Thống kê MID",
        filename: "midinfo.html"
    },
    view_data: {
        name: "Xem dữ liệu",
        filename: "view_data.html"
    }
};
