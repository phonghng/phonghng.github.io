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
                    name: "Kiểm tra tin tức trên <a href='https://www.youtube.com/feed/subscriptions' target='_blank'>YouTube</a>, <a href='https://news.google.com/home?hl=vi&gl=VN&ceid=VN:vi' target='_blank'>Google News</a>, <a href='https://www.msn.com/en-us/channel/topic/Top%20Stories/tp-Y_46b78bbb-31c4-4fc5-8a4a-858072348d06?ocid=windirect&cvid=d6e292ac6fb64ca8a8f20cc0b0adfb3d' target='_blank'>Microsoft Start</a>",
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
                            required: true,
                            point: 50
                        },
                        seafood: {
                            type: "habit_check",
                            name: "Hải sản",
                            required: true,
                            point: 100
                        },
                        nuts_and_whole_grains: {
                            type: "habit_check",
                            name: "Hạt và ngũ cốc",
                            required: true,
                            point: 50
                        }
                    }
                },
                dhc_vitamin_c: {
                    type: "habit_check",
                    name: "Uống hai viên DHC Vitamin C sau ăn trưa",
                    required: true,
                    point: 15
                },
                dhc_canxi_lunch: {
                    type: "habit_check",
                    name: "Uống hai viên DHC Canxi sau ăn trưa 30 phút",
                    required: true,
                    point: 15
                },
                sport: {
                    type: "habit_number",
                    name: "Thể thao",
                    required: true,

                    unit: "phút",
                    point_per_value: 2,
                    goal_value: 15
                },
                skincare: {
                    type: "habit_check",
                    name: "Chăm sóc da mặt",
                    required: true,
                    point: 15
                },
                bath: {
                    type: "habit_check",
                    name: "Tắm rửa, gội đầu",
                    required: true,
                    point: 15
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
                            required: true,
                            point: 50
                        },
                        seafood: {
                            type: "habit_check",
                            name: "Hải sản",
                            required: true,
                            point: 100
                        },
                        nuts_and_whole_grains: {
                            type: "habit_check",
                            name: "Hạt và ngũ cốc",
                            required: true,
                            point: 50
                        }
                    }
                },
                dhc_canxi_dinner: {
                    type: "habit_check",
                    name: "Uống hai viên DHC Canxi sau ăn tối 30 phút",
                    required: true,
                    point: 15
                },
                reading_book: {
                    type: "habit_number",
                    name: "Đọc sách",
                    required: true,

                    unit: "trang",
                    point_per_value: 5,
                    goal_value: 5
                },
                study_for_tomorrow: {
                    type: "habit_check",
                    name: "Học, chuẩn bị bài cho ngày mai",
                    required: true,
                    point: 50
                },
                code_competitive_programming: {
                    type: "habit_number",
                    name: "Luyện lập lập trình thi đấu",
                    required: true,

                    unit: "bài",
                    point_per_value: 50,
                    goal_value: 1
                },
            }
        },
        evening: {
            type: "group",
            name: "Buổi tối",
            children: {
                make_linh_chi: {
                    type: "habit_check",
                    name: "Pha nước linh chi",
                    required: true,
                    point: 15
                },
                evening_hygiene: {
                    type: "habit_check",
                    name: "Đánh răng, rửa mặt tối",
                    required: true,
                    point: 15
                },
                tomorrow_plan: {
                    type: "habit_check",
                    name: "Lập kế hoạch cho ngày mai",
                    required: true,
                    point: 25
                },
                sleep_prepare: {
                    type: "habit_check",
                    name: "Dọn dẹp nơi làm việc, đặt chuông",
                    required: true,
                    point: 15
                },
                rethink: {
                    type: "habit_check",
                    name: "Tự ngẫm về ngày hôm nay",
                    required: true,
                    point: 50
                },
                sleep_early: {
                    type: "habit_check",
                    name: "Ngủ sớm",
                    required: true,
                    point: 150
                }
            }
        },
        daily_review: {
            type: "group",
            name: "Tổng kết ngày",
            children: {
                discipline: {
                    type: "habit_number",
                    name: "Đạt sự kỉ luật",
                    required: true,

                    unit: "điểm/10 điểm",
                    point_per_value: 15,
                    goal_value: 10
                },
                happiness: {
                    type: "habit_number",
                    name: "Đạt sự hạnh phúc",
                    required: true,

                    unit: "điểm/10 điểm",
                    point_per_value: 15,
                    goal_value: 10
                },
                completed_todo: {
                    type: "habit_number",
                    name: "Hoàn thành việc cần làm",
                    required: true,

                    unit: "việc",
                    point_per_value: 50,
                    goal_value: 3
                },
                good_experience: {
                    type: "habit_number",
                    name: "Tham gia trải nghiệm giúp phát triển",
                    required: true,

                    unit: "hoạt động",
                    point_per_value: 50,
                    goal_value: 1
                }
            }
        },
        utils: {
            type: "group",
            name: "Tiện ích",
            children: {
                point_info: {
                    type: "habit_ext",
                    name: "Xem thống kê điểm",
                    extension_id: "point_info"
                },
                view_data: {
                    type: "habit_ext",
                    name: "Xem dữ liệu Mirmor hôm nay",
                    extension_id: "view_data"
                }
            }
        }
    }
};

const EXTENSIONS = {
    point_info: {
        name: "Thống kê điểm",
        filename: "point_info.html"
    },
    view_data: {
        name: "Xem dữ liệu",
        filename: "view_data.html"
    }
};
