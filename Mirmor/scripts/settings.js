const HABITS = {
    type: "group",
    name: "Chương trình Mirmor",
    children: {
        tinh_than: {
            type: "group",
            name: "Phát triển tinh thần",
            children: {
                hanh_vi_hanh_phuc: {
                    type: "habit_number",
                    name: "Hành vi gây sự hạnh phúc",
                    important: false,
                    required: true,

                    unit: "hành vi",
                    point_per_value: 100,
                    goal_value: 1,
                },
                hanh_vi_bat_hanh: {
                    type: "habit_number",
                    name: "Hành vi gây sự bất hạnh",
                    important: false,
                    required: false,

                    unit: "hành vi",
                    point_per_value: -50,
                    goal_value: 0,
                },
                the_hien_cai_toi: {
                    type: "habit_number",
                    name: "Hành vi thể hiện cái tôi quá đáng",
                    important: false,
                    required: false,

                    unit: "hành vi",
                    point_per_value: -75,
                    goal_value: 0,
                },
                thoi_gian_ban_than: {
                    type: "habit_check",
                    name: "Dành thời gian tự ngẫm cho bản thân",
                    important: false,
                    cumulative_period: "week",
                    required: (arguments) => {
                        return (arguments.get_cumulative_info().completed_count == 0
                            && arguments.XDate_function().is_last_day_of.week)
                            || (arguments.get_cumulative_info().completed_count == 1
                                && arguments.get_cumulative_info().is_today_completed);
                    },
                    point: 50
                },
                thoi_gian_gia_dinh: {
                    type: "habit_check",
                    name: "Dành thời gian cho gia đình",
                    important: true,
                    cumulative_period: "week",
                    required: (arguments) => {
                        return (arguments.get_cumulative_info().completed_count == 0
                            && arguments.XDate_function().is_last_day_of.week)
                            || (arguments.get_cumulative_info().completed_count == 1
                                && arguments.get_cumulative_info().is_today_completed);
                    },
                    point: 50
                }
            }
        },
        the_chat: {
            type: "group",
            name: "Phát triển thể chất",
            children: {
                an_uong: {
                    type: "group",
                    name: "Ăn uống",
                    children: {
                        an_sang: {
                            type: "habit_check",
                            name: "Ăn đủ bữa sáng",
                            important: true,
                            required: true,
                            point: 15
                        },
                        an_trua: {
                            type: "habit_check",
                            name: "Ăn đủ bữa trưa (bắt buộc có rau, củ)",
                            important: false,
                            required: true,
                            point: 25
                        },
                        an_trua_them: {
                            type: "habit_check",
                            name: "Ăn bữa trưa có thêm trái cây, hải sản hoặc ngũ cốc",
                            important: true,
                            cumulative_period: "week",
                            required: (arguments) => {
                                return (arguments.get_cumulative_info().completed_count == 0
                                    && arguments.XDate_function().is_last_day_of.week)
                                    || (arguments.get_cumulative_info().completed_count == 1
                                        && arguments.get_cumulative_info().is_today_completed);
                            },
                            point: 50
                        },
                        an_toi: {
                            type: "habit_check",
                            name: "Ăn đủ bữa tối (bắt buộc có rau, củ)",
                            important: false,
                            required: true,
                            point: 25
                        },
                        an_toi_them: {
                            type: "habit_check",
                            name: "Ăn bữa tối có thêm trái cây, hải sản hoặc ngũ cốc",
                            important: true,
                            cumulative_period: "week",
                            required: (arguments) => {
                                return (arguments.get_cumulative_info().completed_count == 0
                                    && arguments.XDate_function().is_last_day_of.week)
                                    || (arguments.get_cumulative_info().completed_count == 1
                                        && arguments.get_cumulative_info().is_today_completed);
                            },
                            point: 50
                        },
                        uong_nuoc: {
                            type: "habit_number",
                            name: "Uống nước trắng",
                            important: false,
                            required: true,

                            unit: "ml",
                            point_per_value: 0.05,
                            goal_value: 2000,
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
                            important: false,
                            required: true,
                            point: 100
                        },
                        day_truoc_7h: {
                            type: "habit_check",
                            name: "Thức dậy trước 7h15",
                            important: true,
                            required: true,
                            point: 25
                        },
                        ngu_truoc_23h: {
                            type: "habit_check",
                            name: "Bắt đầu ngủ trước 23h",
                            important: true,
                            required: true,
                            point: 35
                        }
                    }
                },
                tdtt: {
                    type: "group",
                    name: "Thể dục, thể thao",
                    children: {
                        the_duc_sang: {
                            type: "habit_check",
                            name: "Tập thể dục buổi sáng (theo <a href='https://www.youtube.com/watch?v=MtZmVz305P0' target='_blank'>video sau</a>)",
                            important: true,
                            required: true,
                            point: 25
                        },
                        dap_xe: {
                            type: "habit_number",
                            name: "Đạp xe",
                            important: false,
                            required: true,

                            unit: "phút",
                            point_per_value: 3,
                            goal_value: 10,
                        },
                        boi: {
                            type: "habit_number",
                            name: "Bơi",
                            important: true,
                            cumulative_period: "week",
                            required: (arguments) => {
                                if (![6, 7, 8].includes(
                                    arguments.XDate_function().date_object_expanded.month + 1
                                )) return false;
                                return (arguments.get_cumulative_info().total_value < 60
                                    && arguments.XDate_function().is_last_day_of.week)
                                    || (arguments.get_cumulative_info().total_value < 60
                                        && arguments.get_cumulative_info().today_value > 0);
                            },

                            unit: "phút",
                            point_per_value: 3,
                            goal_value: 30,
                        },
                        bong_ro: {
                            type: "habit_number",
                            name: "Bóng rổ",
                            important: true,
                            cumulative_period: "week",
                            required: (arguments) => {
                                if ([6, 7, 8].includes(
                                    arguments.XDate_function().date_object_expanded.month + 1
                                )) return false;
                                return (arguments.get_cumulative_info().total_value < 60
                                    && arguments.XDate_function().is_last_day_of.week)
                                    || (arguments.get_cumulative_info().total_value < 60
                                        && arguments.get_cumulative_info().today_value > 0);
                            },

                            unit: "phút",
                            point_per_value: 4,
                            goal_value: 30,
                        },
                        khac: {
                            type: "habit_number",
                            name: "Hoạt động khác",
                            important: false,
                            required: false,

                            unit: "phút",
                            point_per_value: 2,
                            goal_value: 0,
                        }
                    }
                }
            }
        },
        ki_nang: {
            type: "group",
            name: "Phát triển kĩ năng",
            children: {
                ki_luat: {
                    type: "group",
                    name: "Kỉ luật",
                    children: {
                        mang_xa_hoi: {
                            type: "habit_check",
                            name: "Chỉ dành thời gian kiểm tra mạng xã hội vào giờ nghỉ trưa, chiều, tối",
                            required: true,
                            important: true,
                            point: 50
                        },
                        an_uong: {
                            type: "habit_check",
                            name: "Không ăn/uống vặt",
                            important: true,
                            required: (arguments) => {
                                return !arguments.XDate_function().is_last_day_of.week;
                            },
                            point: 50
                        },
                        X: {
                            type: "habit_check",
                            name: "Không \"X\"",
                            important: true,
                            required: (arguments) => {
                                return !arguments.XDate_function().is_last_day_of.week;
                            },
                            point: 50
                        },
                        tieu_vat: {
                            type: "habit_check",
                            name: "Không tiêu tiền phung phí",
                            important: true,
                            required: true,
                            point: 50
                        }
                    }
                },
                lam_viec: {
                    type: "group",
                    name: "Làm việc",
                    children: {
                        kiem_tra_lich: {
                            type: "habit_check",
                            name: "Kiểm tra lịch hoạt động, mục Mirmor hôm nay",
                            important: false,
                            required: true,
                            point: 15
                        },
                        dau_viec: {
                            type: "habit_number",
                            name: "Số đầu việc hoàn thành (tự đánh giá độ khó)",
                            important: false,
                            required: true,

                            unit: "đầu việc",
                            point_per_value: 15,
                            goal_value: 1,
                        },
                        tap_trung_lam_viec: {
                            type: "habit_number",
                            name: "Thời gian tập trung hoàn thành công việc",
                            important: false,
                            required: true,

                            unit: "phút",
                            point_per_value: 0.5,
                            goal_value: 15,
                        },
                        lap_lich_ngay_mai: {
                            type: "habit_check",
                            name: "Lập lịch hoạt động ngày mai (có rõ thực hiện các mục Mirmor; tạo khung thời gian ngắn); khởi tạo Mirmor ngày mai",
                            important: false,
                            required: true,
                            point: 15
                        },
                    }
                },
                ngoai_hinh: {
                    type: "group",
                    name: "Ngoại hình",
                    children: {
                        danh_rang_sang: {
                            type: "habit_check",
                            name: "Đánh răng, rửa mặt buổi sáng",
                            important: false,
                            required: true,
                            point: 15
                        },
                        danh_rang_toi: {
                            type: "habit_check",
                            name: "Đánh răng, rửa mặt buổi tối",
                            important: false,
                            required: true,
                            point: 15
                        },
                        rua_mat: {
                            type: "habit_check",
                            name: "Rửa mặt (Garnier Skin Natuarals Bright Complete Anti-Acne Cleansing Foam)",
                            important: false,
                            required: true,
                            point: 10
                        },
                        tam_goi: {
                            type: "habit_check",
                            name: "Tắm, gội đầu",
                            important: false,
                            required: true,
                            point: 25
                        },
                        uong_tpcn: {
                            type: "habit_check",
                            name: "Uống 1 viên DHC Multi Vitamins, 3 viên DHC Minerals, 3 viên Omega 3 Pure Alaska Omega 333mg EPA DHA",
                            important: true,
                            required: true,
                            point: 25
                        },
                        chuan_bi_ra_ngoai: {
                            type: "habit_check",
                            name: "Bôi kem chống nắng (Vichy Capital Soleil Anti Brillance Mattifying SPF50+ UVB+UVA), ăn mặc, để tóc phù hợp khi ra ngoài",
                            important: false,
                            required: true,
                            point: 35
                        },
                        ve_sinh_dinh_ki: {
                            type: "habit_check",
                            name: "Cắt móng tay, cắt móng chân, cạo râu, rửa khăn mặt",
                            important: false,
                            cumulative_period: "week",
                            required: (arguments) => {
                                return (arguments.get_cumulative_info().completed_count == 0
                                    && arguments.XDate_function().is_last_day_of.week)
                                    || (arguments.get_cumulative_info().completed_count == 1
                                        && arguments.get_cumulative_info().is_today_completed);
                            },
                            point: 25
                        }
                    }
                },
                hoat_dong_phat_trien: {
                    type: "habit_number",
                    name: "Tham gia hoạt động phát triển kĩ năng",
                    important: false,
                    cumulative_period: "week",
                    required: (arguments) => {
                        return (arguments.get_cumulative_info().total_value < 1
                            && arguments.XDate_function().is_last_day_of.week)
                            || (arguments.get_cumulative_info().total_value < 1
                                && arguments.get_cumulative_info().today_value > 0);
                    },

                    unit: "hoạt động",
                    point_per_value: 100,
                    goal_value: 1,
                }
            }
        },
        kien_thuc: {
            type: "group",
            name: "Phát triển kiến thức",
            children: {
                kiem_tra_tin_tuc: {
                    type: "habit_check",
                    name: "Kiểm tra các nội dung đăng kí trên YouTube, tin tức",
                    important: false,
                    cumulative_period: "week",
                    required: (arguments) => {
                        return (arguments.get_cumulative_info().completed_count == 0
                            && arguments.XDate_function().is_last_day_of.week)
                            || (arguments.get_cumulative_info().completed_count == 1
                                && arguments.get_cumulative_info().is_today_completed);
                    },
                    point: 50
                },
                doc_sach: {
                    type: "habit_number",
                    name: "Đọc sách",
                    important: false,
                    required: true,

                    unit: "trang",
                    point_per_value: 15,
                    goal_value: 3,
                }
            }
        },
        kiem_soat: {
            type: "group",
            name: "Kiểm soát",
            children: {
                tong_ket_tuan: {
                    type: "habit_check",
                    name: "Tổng kết, đánh giá, điều chỉnh, quán triệt thực hiện kế hoạch phát triển kĩ năng và kiến thức",
                    important: true,
                    cumulative_period: "week",
                    required: (arguments) => {
                        return (arguments.get_cumulative_info().completed_count == 0
                            && arguments.XDate_function().is_last_day_of.week)
                            || (arguments.get_cumulative_info().completed_count == 1
                                && arguments.get_cumulative_info().is_today_completed);
                    },
                    point: 50
                },
                tru_cot_phat_trien: {
                    type: "habit_check",
                    name: "Tổng kết, đánh giá, hoạch định, điều chỉnh các trụ cột phát triển",
                    important: true,
                    cumulative_period: "month",
                    required: (arguments) => {
                        return (arguments.get_cumulative_info().completed_count == 0
                            && arguments.XDate_function().is_last_day_of.month)
                            || (arguments.get_cumulative_info().completed_count == 1
                                && arguments.get_cumulative_info().is_today_completed);
                    },
                    point: 50
                },
                ra_soat_Mirmor: {
                    type: "habit_check",
                    name: "Rà soát, đánh giá, điều chỉnh các mục Mirmor",
                    important: true,
                    cumulative_period: "month",
                    required: (arguments) => {
                        return (arguments.get_cumulative_info().completed_count == 0
                            && arguments.XDate_function().is_last_day_of.month)
                            || (arguments.get_cumulative_info().completed_count == 1
                                && arguments.get_cumulative_info().is_today_completed);
                    },
                    point: 25
                },
                tong_ket_thang: {
                    type: "habit_check",
                    name: "Tổng kết, đánh giá, lập kế hoạch phát triển kĩ năng và kiến thức",
                    important: true,
                    cumulative_period: "month",
                    required: (arguments) => {
                        return (arguments.get_cumulative_info().completed_count == 0
                            && arguments.XDate_function().is_last_day_of.month)
                            || (arguments.get_cumulative_info().completed_count == 1
                                && arguments.get_cumulative_info().is_today_completed);
                    },
                    point: 50
                },
                tong_ket_quy: {
                    type: "habit_check",
                    name: "Tổng kết, đánh giá, hoạch định mục tiêu phát triển kĩ năng và kiến thức",
                    important: true,
                    cumulative_period: "year_quarter",
                    required: (arguments) => {
                        return (arguments.get_cumulative_info().completed_count == 0
                            && arguments.XDate_function().is_last_day_of.year_quarter)
                            || (arguments.get_cumulative_info().completed_count == 1
                                && arguments.get_cumulative_info().is_today_completed);
                    },
                    point: 100
                }
            }
        },
        xem_chuoi: {
            type: "habit_ext",
            name: "Xem thống kê chuỗi Mipo dương",
            extension_id: "streak_viewer"
        },
        xem_thong_ke: {
            type: "habit_ext",
            name: "Xem thống kê Mipo",
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
        name: "Thống kê Mipo",
        filename: "point_info.html"
    },
    streak_viewer: {
        name: "Thống kê chuỗi Mipo dương",
        filename: "streak_viewer.html"
    },
    view_data: {
        name: "Dữ liệu Mirmor hôm nay",
        filename: "view_data.html"
    }
};
