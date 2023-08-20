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
                    name: "Dậy trước 06:00",
                    required: true,
                    point: 15
                },
                make_bed: {
                    type: "habit_check",
                    name: "Dọn giường",
                    required: true,
                    point: 15
                },
                quote: {
                    type: "habit_ext",
                    name: "Xem trích dẫn",
                    extension_id: "quote"
                },
                check_todos: {
                    type: "habit_check",
                    name: "Kiểm tra việc cần làm",
                    required: true,
                    point: 15
                },
                check_news: {
                    type: "habit_check",
                    name: "Kiểm tra tin tức",
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
                            name: "Đánh giá tổng thể về Mirmor",
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
                        },
                        life_plan: {
                            type: "habit_check",
                            name: "Chiêm nghiệm về cuộc đời, lên kế hoạch cho cuộc đời",
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
                eat_lunch: {
                    type: "group",
                    name: "Ăn trưa",
                    children: {
                        water: {
                            type: "habit_number",
                            name: "Uống nước",
                            required: true,

                            unit: "ml",
                            point_per_value: 0.05,
                            goal_value: 1000,
                        },
                        vegatable: {
                            type: "habit_check",
                            name: "Rau củ",
                            required: true,
                            point: 50
                        },
                        good_drink: {
                            type: "habit_check",
                            name: "Nước trái cây, nước bổ",
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
                    type: "group",
                    name: "Tập thể thao",
                    children: {
                        cycling: {
                            type: "habit_number",
                            name: "Đạp xe",
                            required: (arguments) => {
                                let day_in_week = arguments.XDate_function().date_object_expanded.day;
                                let month = arguments.XDate_function().date_object_expanded.month;
                                return ![5, 6, 7].includes(month)
                                    || !(day_in_week == 2 || day_in_week == 5);
                            },

                            unit: "phút",
                            point_per_value: 2,
                            goal_value: 15
                        },
                        badminton: {
                            type: "habit_number",
                            name: "Cầu lông",
                            required: false,

                            unit: "phút",
                            point_per_value: 2,
                            goal_value: 30
                        },
                        swimming: {
                            type: "habit_number",
                            name: "Bơi lội",
                            required: (arguments) => {
                                let day_in_week = arguments.XDate_function().date_object_expanded.day;
                                let month = arguments.XDate_function().date_object_expanded.month;
                                return [5, 6, 7].includes(month)
                                    && (day_in_week == 2 || day_in_week == 5);
                            },

                            unit: "phút",
                            point_per_value: 3,
                            goal_value: 30
                        },
                        walk_run: {
                            type: "habit_number",
                            name: "Đi bộ/chạy bộ",
                            required: false,

                            unit: "phút",
                            point_per_value: 1.5,
                            goal_value: 0
                        },
                        laboring: {
                            type: "habit_number",
                            name: "Lao động",
                            required: false,

                            unit: "phút",
                            point_per_value: 1,
                            goal_value: 0
                        }
                    }
                },
                bath: {
                    type: "habit_check",
                    name: "Tắm rửa, gội đầu trước 19:00",
                    required: true,
                    point: 15
                },
                eat_dinner: {
                    type: "group",
                    name: "Ăn tối",
                    children: {
                        water: {
                            type: "habit_number",
                            name: "Uống nước",
                            required: true,

                            unit: "ml",
                            point_per_value: 0.05,
                            goal_value: 1000,
                        },
                        vegatable: {
                            type: "habit_check",
                            name: "Rau củ",
                            required: true,
                            point: 50
                        },
                        good_drink: {
                            type: "habit_check",
                            name: "Nước trái cây, nước bổ",
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
                completed_all_todo: {
                    type: "habit_check",
                    name: "Hoàn thành tất cả việc cần làm",
                    required: true,
                    point: 100
                },
                reading_book: {
                    type: "habit_number",
                    name: "Đọc sách",
                    required: false,

                    unit: "trang",
                    point_per_value: 5,
                    goal_value: 25
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
                    name: "Ngủ trước 22:00",
                    required: true,
                    point: 150
                }
            }
        },
        review_activity: {
            type: "group",
            name: "Đánh giá",
            children: {
                Doi_Gio_planning: {
                    type: "group",
                    name: "Kế hoạch Đổi Gió",
                    children: {
                        dexterity: {
                            type: "habit_check",
                            name: "Kĩ tính",
                            required: true,
                            point: 50
                        },
                        happy: {
                            type: "habit_check",
                            name: "Hạnh phúc",
                            required: true,
                            point: 50
                        },
                        decisive: {
                            type: "habit_check",
                            name: "Quyết đoán",
                            required: true,
                            point: 50
                        },
                        reckless: {
                            type: "habit_check",
                            name: "Táo bạo",
                            required: true,
                            point: 50
                        },
                        methodical: {
                            type: "habit_check",
                            name: "Quy củ",
                            required: true,
                            point: 50
                        },
                        self_learning: {
                            type: "habit_check",
                            name: "Tự học",
                            required: true,
                            point: 50
                        },
                        exquisite: {
                            type: "habit_check",
                            name: "Tinh tế",
                            required: true,
                            point: 50
                        },
                        sincerely: {
                            type: "habit_check",
                            name: "Chân thành",
                            required: true,
                            point: 50
                        },
                        friendly: {
                            type: "habit_check",
                            name: "Thân thiện",
                            required: true,
                            point: 50
                        },
                        reconciliation: {
                            type: "habit_check",
                            name: "Hoà giải",
                            required: true,
                            point: 50
                        },
                        responsibility: {
                            type: "habit_check",
                            name: "Trách nhiệm",
                            required: true,
                            point: 50
                        },
                        humble: {
                            type: "habit_check",
                            name: "Khiêm tốn",
                            required: true,
                            point: 50
                        },
                        patience: {
                            type: "habit_check",
                            name: "Điềm tĩnh",
                            required: true,
                            point: 50
                        },
                        discipline: {
                            type: "habit_check",
                            name: "Kỉ luật",
                            required: true,
                            point: 50
                        },
                        prominence: {
                            type: "habit_check",
                            name: "Nổi bật",
                            required: true,
                            point: 50
                        }
                    }
                },
                time_for_experience: {
                    type: "habit_number",
                    name: "Thời gian hoạt động trải nghiệm, xã hội",
                    required: false,

                    unit: "phút",
                    point_per_value: 2,
                    goal_value: 60
                },
                volunteering_activities: {
                    type: "habit_number",
                    name: "Hoạt động thiện nguyện",
                    required: false,

                    unit: "lần",
                    point_per_value: 150,
                    goal_value: 0
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
    quote: {
        name: "Trích dẫn",
        filename: "quote.html"
    },
    view_data: {
        name: "Xem dữ liệu",
        filename: "view_data.html"
    }
};
