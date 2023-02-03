<script setup>
	import { onMounted } from "vue";
	import overviewIcon from "@/assets/img/Vectorstaff-ovvw-ico.svg";
    import fileIcon from "@/assets/img/Vector-File-Attachments.svg";
    import basicInfoIcon from "@/assets/img/Vector-Basic-Information.svg";
    import contactInfoIcon from "@/assets/img/Vector-Contact-Information.svg";
    import empHistIcon from "@/assets/img/Vector-Employment-History.svg";
    import workPrefIcon from "@/assets/img/Vector-Work-Preference.svg";
    import skillsIcon from "@/assets/img/Vector-Skills.svg";
    import charRefIcon from "@/assets/img/Vector-Character-Reference.svg";
    import educAttainIcon from "@/assets/img/Vector-Educational-Attainment.svg";
    import workHomeIcon from "@/assets/img/Vector-Work-From-Home-Resources.svg";
    import appliedJobsIcon from "@/assets/img/Vector-Applied-Jobs.svg";
	import setTooltip from "@/assets/js/tooltip";
	import { useAppStore } from "@/stores";
	const store = useAppStore();
	
	onMounted(() => {
		setTooltip(store.bootstrap);
	});
</script>

<script>
	
	export default {
		data() {
			return { activeItem: 'staff_overview' }
		},
		methods: {
			isActive: function (menuItem) {
				return this.activeItem === menuItem
			},
			setActive: function (menuItem) {
				this.activeItem = menuItem 
			}
		}
	}

</script>

<template>
	<nav
		class="navbar navbar-expand-lg top-0 mx-2 my-3 mt-0 blur border-radius-md shadow rs-bg p-0"
	>
		<div class="m-auto">
			<ul class="nav flex-row mb-auto">
				<li class="nav-item " id="li_first"
					data-bs-toggle="tooltip"
					data-bs-placement="bottom"
					title="Staff Overview">
					<RouterLink to="staff-overview" class="nav-link">
						<img :src="overviewIcon" />
					</RouterLink>
				</li>
				<li class="nav-item"
					data-bs-toggle="tooltip"
					data-bs-placement="bottom"
					title="Basic Information">
					<RouterLink to="basic-information" class="nav-link">
						<img :src="basicInfoIcon" />
					</RouterLink>
				</li>
				<li class="nav-item"
					data-bs-toggle="tooltip"
					data-bs-placement="bottom"
					title="File Attachments">
					<RouterLink to="file-attachments" class="nav-link">
						<img :src="fileIcon" />
					</RouterLink>
				</li>
				<li class="nav-item" 
					data-bs-toggle="tooltip"
					data-bs-placement="bottom"
					title="Contact Information">
					<RouterLink to="contact-information" class="nav-link">
						<img :src="contactInfoIcon" />
					</RouterLink>
				</li>
				<li class="nav-item"
					data-bs-toggle="tooltip"
					data-bs-placement="bottom"
					title="Work History">
					<RouterLink to="employment-history" class="nav-link">
						<img :src="empHistIcon" />
					</RouterLink>
				</li>
				<li class="nav-item"
					data-bs-toggle="tooltip"
					data-bs-placement="bottom"
					title="Work Preference">
					<RouterLink to="work-preference" class="nav-link">
						<img :src="workPrefIcon" />
					</RouterLink>
				</li>
				<li class="nav-item"
					data-bs-toggle="tooltip"
					data-bs-placement="bottom"
					title="Skills">
					<RouterLink to="skills" class="nav-link">
						<img :src="skillsIcon" />
					</RouterLink>
				</li>
				<li class="nav-item"
					data-bs-toggle="tooltip"
					data-bs-placement="bottom"
					title="Character Reference">
					<RouterLink to="character-reference" class="nav-link">
						<img :src="charRefIcon" />
					</RouterLink>
				</li>
				<li class="nav-item"
					data-bs-toggle="tooltip"
					data-bs-placement="bottom"
					title="Educational Attainment">
					<RouterLink to="educational-attainment" class="nav-link">
						<img :src="educAttainIcon" />
					</RouterLink>
				</li>
				<li class="nav-item"
					data-bs-toggle="tooltip"
					data-bs-placement="bottom"
					title="Work From Home Resources">
					<RouterLink to="wfh-resources" class="nav-link">
						<img :src="workHomeIcon" />
					</RouterLink>
				</li>
				<li class="nav-item"
					data-bs-toggle="tooltip"
					data-bs-placement="bottom"
					title="Applied Jobs">
					<RouterLink to="applied-jobs" class="nav-link">
						<img :src="appliedJobsIcon" />
					</RouterLink>
				</li>
			</ul>
		</div>
	</nav>
<!-- End Navbar -->
</template>

<style scoped>
	.rs-bg {
		background-color: #0B0724 !important;
	}
    .nav-link {
        color: #fff !important;
		height: 100%;
    }
    .nav-link:hover{
        font-weight: bold;
        color: #fff !important;
        background-color: #5E44FF  !important;
    }
    .nav-link:hover img{
        filter: invert(1)  brightness(0) 
    }
    .router-link-active{
        background-color: #5E44FF  !important;
    }
    .nav-item {
        border-radius: 2px;
    }
    .router-link-active img {
        filter: invert(1) brightness(0) 
    }
    
</style>