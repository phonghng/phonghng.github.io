const HABITS = {
    type: "group",
    name: "Thói quen Mirmor v.1",
    description: "Các thói quen thực hiện hàng ngày",
    children: {
        morning: {
            type: "group",
            name: "Buổi sáng",
            description: "Các thói quen thực hiện trong buổi sáng, ngay sau khi dậy",
            children: {
                get_up: {
                    type: "habit_check",
                    name: "Dậy khỏi giường",
                    description: "Dậy khỏi giường, tắt chuông kêu, bật điện phòng",
                    point: 1
                },
                drink_water: {
                    type: "habit_check",
                    name: "Uống nước",
                    description: "Uống cốc nước đã chuẩn bị, lượng nước này sẽ không tính vào tiêu chuẩn hàng ngày",
                    point: 1
                },
                hygiene: {
                    type: "habit_check",
                    name: "Đánh răng + rửa mặt",
                    description: "Đánh răng kĩ, bằng tay không thuận và rửa mặt sạch",
                    point: 1
                },
                take_calcium: {
                    type: "habit_check",
                    name: "Uống canxi",
                    description: "Uống canxi, lượng nước để uống sẽ không tính vào tiêu chuẩn hàng ngày",
                    point: 1
                },
                make_bed: {
                    type: "habit_check",
                    name: "Dọn giường",
                    description: "Phủi bụi trên giường và gấp lại chăn, xếp lại giường",
                    point: 1
                },
                meditation: {
                    type: "habit_ext",
                    name: "Thiền",
                    description: "Thiền theo hướng dẫn",
                    extension_id: "meditation"
                },
                exercise: {
                    type: "habit_ext",
                    name: "Tập thể dục",
                    description: "Tập thể dục theo hướng dẫn",
                    extension_id: "exercise"
                },
                breakfast: {
                    type: "habit_check",
                    name: "Ăn sáng",
                    description: "Ăn sáng đầy đủ và cố gắng lành mạnh",
                    point: 15
                },
                clean_room: {
                    type: "habit_check",
                    name: "Dọn phòng (Chủ nhật)",
                    description: "Lau bàn, quét phòng, lau phòng,...",
                    point: 10
                }
            }
        },
        daytime: {
            type: "group",
            name: "Trong ngày",
            description: "Các thói quen có thể thực hiện xuyên suốt trong ngày",
            children: {
                drink_water: {
                    type: "habit_ext",
                    name: "Uống nước",
                    description: "Uống nước theo tiêu chuẩn",
                    extension_id: "drink_water"
                },
                check_news: {
                    type: "habit_check",
                    name: "Kiểm tra tin tức",
                    description: "Kiểm tra các nội dung hữu ích để mở rộng sự hiểu biết nhằm đạt mục đích về kiến thức, giao tiếp. Các nguồn: YouTube, Facebook, Wikipedia,....",
                    point: 10
                },
                reading: {
                    type: "habit_ext",
                    name: "Đọc sách",
                    description: "Đọc sách ở ngoài trời hoặc các môi trường như lớp học,...",
                    extension_id: "reading"
                },
                cook_lunch: {
                    type: "habit_check",
                    name: "Cắm cơm, dọn mâm cơm trưa",
                    description: "Cắm cơm, dọn mâm cơm trưa gọn gàng và tốt",
                    point: 2
                },
                eat_lunch: {
                    type: "habit_ext",
                    name: "Ăn trưa",
                    description: "Ăn trưa theo tiêu chuẩn",
                    extension_id: "eat_lunch"
                },
                productivity: {
                    type: "habit_ext",
                    name: "Năng suất",
                    description: "Đạt được năng suất thực sự",
                    extension_id: "productivity"
                },
                study: {
                    type: "habit_check",
                    name: "Học tập",
                    description: "Học bài ở lớp, tự học, học lập trình,...",
                    point: 20
                },
                sport: {
                    type: "habit_ext",
                    name: "Tập thể thao",
                    description: "Chơi cầu lông, đạp xe, bơi lội, sử dụng máy tập, đi bộ và chạy bộ,...",
                    extension_id: "sport"
                },
                bath: {
                    type: "habit_check",
                    name: "Tắm giặt + rửa khăn mặt",
                    description: "Tắm giặt, rửa khăn mặt kĩ và phơi khô",
                    point: 2
                },
                cook_dinner: {
                    type: "habit_check",
                    name: "Cắm cơm, dọn mâm cơm tối",
                    description: "Cắm cơm, dọn mâm cơm tối gọn gàng và tốt",
                    point: 2
                },
                eat_dinner: {
                    type: "habit_ext",
                    name: "Ăn tối",
                    description: "Ăn tối theo tiêu chuẩn",
                    extension_id: "eat_dinner"
                },
                happiness: {
                    type: "habit_ext",
                    name: "Hạnh phúc",
                    description: "Đạt được sự hạnh phúc thực sự",
                    extension_id: "happiness"
                },
                no_gas_drink: {
                    type: "habit_check",
                    name: "Không uống nước có gas, nước ngọt",
                    description: "Không uống nước có gas, nước ngọt",
                    point: 50
                },
                no_fap: {
                    type: "habit_check",
                    name: "Không đồngm",
                    description: "Không xem Opera và không đồngm",
                    point: 50
                }
            }
        },
        evening: {
            type: "group",
            name: "Buổi tối",
            description: "Các thói quen thực hiện trong buổi tối, trước khi đi ngủ",
            children: {
                hygiene: {
                    type: "habit_check",
                    name: "Đánh răng + rửa mặt",
                    description: "Đánh răng kĩ, bằng tay không thuận và rửa mặt sạch",
                    point: 1
                },
                export_data: {
                    type: "habit_ext",
                    name: "Xuất dữ liệu",
                    description: "Xuất dữ liệu (của ngày hôm nay) dưới dạng JSON và lưu vào Notion",
                    extension_id: "export_data"
                },
                planning: {
                    type: "habit_check",
                    name: "Lập kế hoạch cho ngày hôm sau",
                    description: "Lập kế hoạch cho ngày hôm sau trên Notion",
                    point: 1
                },
                sleep_prepare: {
                    type: "habit_check",
                    name: "Chuẩn bị để ngủ",
                    description: "Đặt đồng hồ ở xa giường, dọn dẹp, tắt điện, chuẩn bị chuông",
                    point: 1
                },
                mood_prepare: {
                    type: "habit_check",
                    name: "Chuẩn bị tinh thần",
                    description: "Tạo sự hào hứng cho việc thực hiện các thói quen cho ngày hôm sau",
                    point: 1
                },
                sleep: {
                    type: "habit_ext",
                    name: "Ngủ đúng giờ",
                    description: "Ngủ theo thời gian được tính theo công thức",
                    extension_id: "sleep"
                }
            }
        }
    }
};

const EXTENSIONS = {
    export_data: {
        name: "Xuất dữ liệu",
        filename: "export_data.html"
    },
    meditation: {
        name: "Thiền",
        filename: "meditation.html"
    },
    exercise: {
        name: "Tập thể dục",
        filename: "exercise.html"
    },
    reading: {
        name: "Đọc sách",
        filename: "reading.html"
    },
    sport: {
        name: "Tập thể thao",
        filename: "sport.html"
    },
    eat_lunch: {
        name: "Ăn trưa",
        filename: "eat_lunch.html"
    },
    eat_dinner: {
        name: "Ăn tối",
        filename: "eat_dinner.html"
    },
    sleep: {
        name: "Ngủ",
        filename: "sleep.html"
    },
    drink_water: {
        name: "Uống nước",
        filename: "drink_water.html"
    },
    happiness: {
        name: "Hạnh phúc",
        filename: "happiness.html"
    },
    productivity: {
        name: "Năng suất",
        filename: "productivity.html"
    }
};