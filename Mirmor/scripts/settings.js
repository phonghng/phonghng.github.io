const HABITS = {
    type: "group",
    name: "Chương trình Mirmor",
    children: {
        tinh_than: {
            type: "group",
            name: "Tinh thần",
            children: {
                hanh_vi_hanh_phuc: {
                    type: "habit_number",
                    name: "Hành vi gây sự hạnh phúc",
                    required: false,

                    unit: "hành vi",
                    point_per_value: 100,
                    goal_value: 0,
                },
                hanh_vi_bat_hanh: {
                    type: "habit_number",
                    name: "Hành vi gây sự bất hạnh, thể hiện cái tôi quá đáng",
                    required: false,

                    unit: "hành vi",
                    point_per_value: -75,
                    goal_value: 0,
                },
                thoi_gian_ban_than: {
                    type: "habit_check",
                    name: "Dành thời gian tự ngẫm cho bản thân",
                    point: 50,
                    required: (arguments) => {
                        return arguments.XDate_function().is_last_day_of.week;
                    }
                },
                thoi_gian_gia_dinh: {
                    type: "habit_check",
                    name: "Trong tuần, có dành thời gian cho gia đình",
                    point: 50,
                    required: (arguments) => {
                        return arguments.XDate_function().is_last_day_of.week;
                    }
                }
            }
        },
        the_chat: {
            type: "group",
            name: "Thể chất",
            children: {
                an_uong: {
                    type: "group",
                    name: "Ăn uống",
                    children: {
                        an_sang: {
                            type: "habit_check",
                            name: "Ăn đủ bữa sáng",
                            required: true,
                            point: 15
                        },
                        an_trua: {
                            type: "habit_check",
                            name: "Ăn đủ bữa trưa (bắt buộc có rau, củ)",
                            required: true,
                            point: 25
                        },
                        an_trua_them: {
                            type: "habit_check",
                            name: "Ăn bữa trưa có thêm trái cây, hải sản hoặc ngũ cốc",
                            required: true,
                            point: 50
                        },
                        an_toi: {
                            type: "habit_check",
                            name: "Ăn đủ bữa tối (bắt buộc có rau, củ)",
                            required: true,
                            point: 25
                        },
                        an_toi_them: {
                            type: "habit_check",
                            name: "Ăn bữa tối có thêm trái cây, hải sản hoặc ngũ cốc",
                            required: true,
                            point: 50
                        },
                        uong_nuoc: {
                            type: "habit_number",
                            name: "Uống nước trắng",
                            required: true,

                            unit: "ml",
                            point_per_value: 0.05,
                            goal_value: 2000,
                        },
                        uong_thuoc: {
                            type: "habit_check",
                            name: "Uống các loại thuốc, thực phẩm chức năng (nếu cần)",
                            required: true,
                            point: 15
                        },
                        khong_uong_vat_an_vat: {
                            type: "habit_check",
                            name: "Không uống vặt, ăn vặt",
                            required: true,
                            point: 75
                        }
                    }
                },
                nghi_ngoi: {
                    type: "group",
                    name: "Nghỉ ngơi",
                    children: {
                        ngu_du: {
                            type: "habit_check",
                            name: "Ngủ đủ 7 tiếng",
                            required: true,
                            point: 100
                        },
                        day_truoc_7h: {
                            type: "habit_check",
                            name: "Thức dậy, đánh răng, rửa mặt trước 7h15",
                            required: true,
                            point: 25
                        },
                        ngu_truoc_23h: {
                            type: "habit_check",
                            name: "Bắt đầu ngủ trước 23h",
                            required: true,
                            point: 35
                        },
                        khong_X: {
                            type: "habit_check",
                            name: "Không X",
                            required: true,
                            point: 50
                        }
                    }
                },
                tdtt: {
                    type: "group",
                    name: "Thể dục, thể thao",
                    children: {
                        // TODO
                    }
                }
            }
        },
        nang_luc: {
            type: "group",
            name: "Năng lực",
            children: {
                cong_viec: {
                    type: "group",
                    name: "Công việc",
                    children: {
                        kiem_tra_lich: {
                            type: "habit_check",
                            name: "Kiểm tra lịch hoạt động, mục Mirmor hôm nay",
                            required: true,
                            point: 15
                        },
                        dau_viec: {
                            type: "habit_number",
                            name: "Số đầu việc hoàn thành (tự đánh giá độ khó)",
                            required: false,

                            unit: "đầu việc",
                            point_per_value: 15,
                            goal_value: 0,
                        },
                        tap_trung_lam_viec: {
                            type: "habit_number",
                            name: "Thời gian tập trung hoàn thành công việc",
                            required: false,

                            unit: "phút",
                            point_per_value: 0.5,
                            goal_value: 0,
                        },
                        hoat_dong_phat_trien: {
                            type: "habit_number",
                            name: "Tham gia hoạt động phát triển năng lực",
                            required: false,

                            unit: "hoạt động",
                            point_per_value: 50,
                            goal_value: 0,
                        },
                        lap_lich_ngay_mai: {
                            type: "habit_check",
                            name: "Lập lịch hoạt động ngày mai (có rõ thực hiện các mục Mirmor)",
                            required: true,
                            point: 15
                        }
                    }
                },
                ngoai_hinh: {
                    type: "group",
                    name: "Ngoại hình",
                    children: {
                        // TODO
                    }
                },
                doc_sach: {
                    type: "habit_number",
                    name: "Đọc sách",
                    required: true,

                    unit: "trang",
                    point_per_value: 15,
                    goal_value: 3,
                },
                hoat_dong_phat_trien: {
                    type: "habit_number",
                    name: "Tham gia hoạt động phát triển năng lực",
                    required: false,

                    unit: "hoạt động",
                    point_per_value: 50,
                    goal_value: 0,
                },
                khong_tiktok_facebook: {
                    type: "habit_check",
                    name: "Không sử dụng TikTok, Facebook quá 120 phút",
                    required: true,
                    point: 50
                },
            }
        },
        kiem_soat: {
            type: "group",
            name: "Kiểm soát",
            children: {
                mipo_vuot_amepo: {
                    type: "habit_check",
                    name: "Mipo (không kể mục này) vượt Amepo",
                    required: true,
                    point: 50
                },
                thuc_hien_muc_bat_buoc: {
                    type: "habit_check",
                    name: "Thực hiện đầy đủ các mục bắt buộc",
                    required: true,
                    point: 75
                },
                tong_ket_thang: {
                    type: "habit_check",
                    name: "Tổng kết tháng qua, lên kế hoạch cho tháng tới theo cấu trúc \"Vọng Nguyệt\"",
                    required: (arguments) => {
                        return arguments.XDate_function().is_last_day_of.month;
                    },
                    point: 35
                },
                ra_soat_Mirmor: {
                    type: "habit_check",
                    name: "Rà soát, đánh giá, sửa đổi, bổ sung tổng thể Mirmor",
                    required: (arguments) => {
                        return arguments.XDate_function().is_last_day_of.month;
                    },
                    point: 25
                },
                ra_soat_PPUP_RMS: {
                    type: "habit_check",
                    name: "Rà soát, sửa đổi, bổ sung PPUP-RMS",
                    required: (arguments) => {
                        return arguments.XDate_function().is_last_day_of.month;
                    },
                    point: 15
                },
                tong_ket_quy: {
                    type: "habit_check",
                    name: "Tổng kết quý qua, lên kế hoạch cho quý tới về ba trụ cột phát triển (tinh thần, thể chất, năng lực), các mục tiêu, các kế hoạch",
                    required: (arguments) => {
                        return arguments.XDate_function().is_last_day_of.year_quarter;
                    },
                    point: 75
                },
                tong_ket_nam: {
                    type: "habit_check",
                    name: "Tổng kết năm qua, lên kế hoạch cho năm tới về ba trụ cột phát triển (tinh thần, thể chất, năng lực), các mục tiêu, các kế hoạch",
                    required: (arguments) => {
                        return arguments.XDate_function().is_last_day_of.year;
                    },
                    point: 150
                }
            }
        },
        xem_thong_ke: {
            type: "habit_ext",
            name: "Xem thống kê điểm",
            extension_id: "point_info"
        },
        xem_du_lieu: {
            type: "habit_ext",
            name: "Xem dữ liệu Mirmor hôm nay",
            extension_id: "view_data"
        }
    }
};

const EXTENSIONS = {
    point_info: {
        name: "Thống kê điểm",
        filename: "point_info.html"
    },
    view_data: {
        name: "Dữ liệu Mirmor hôm nay",
        filename: "view_data.html"
    }
};
