<?php

// @formatter:off
// phpcs:ignoreFile
/**
 * A helper file for your Eloquent Models
 * Copy the phpDocs from this file to the correct Model,
 * And remove them from this file, to prevent double declarations.
 *
 * @author Barry vd. Heuvel <barryvdh@gmail.com>
 */


namespace App\Models{
/**
 * @property int $id
 * @property int $directory_profile_id
 * @property int|null $agent_id
 * @property string $tier
 * @property numeric $amount_collected
 * @property \Illuminate\Support\Carbon|null $starts_at
 * @property \Illuminate\Support\Carbon|null $ends_at
 * @property string $status
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Admin|null $agent
 * @property-read \App\Models\DirectoryProfile $directoryProfile
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AdPlacement newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AdPlacement newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AdPlacement query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AdPlacement whereAgentId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AdPlacement whereAmountCollected($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AdPlacement whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AdPlacement whereDirectoryProfileId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AdPlacement whereEndsAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AdPlacement whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AdPlacement whereStartsAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AdPlacement whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AdPlacement whereTier($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AdPlacement whereUpdatedAt($value)
 */
	class AdPlacement extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $name
 * @property string $email
 * @property string|null $avatar
 * @property string $password
 * @property string $role
 * @property bool $is_active
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property int|null $manager_id
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\AdPlacement> $adPlacements
 * @property-read int|null $ad_placements_count
 * @property-read Admin|null $manager
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\DirectoryProfile> $onboardedProfiles
 * @property-read int|null $onboarded_profiles_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Payout> $payouts
 * @property-read int|null $payouts_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\InternalTicket> $resolvedInternalTickets
 * @property-read int|null $resolved_internal_tickets_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\SupportTicket> $resolvedSupportTickets
 * @property-read int|null $resolved_support_tickets_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, Admin> $subordinates
 * @property-read int|null $subordinates_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Admin newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Admin newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Admin query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Admin whereAvatar($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Admin whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Admin whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Admin whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Admin whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Admin whereManagerId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Admin whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Admin wherePassword($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Admin whereRole($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Admin whereUpdatedAt($value)
 */
	class Admin extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $admin_id
 * @property string $action
 * @property string $method
 * @property string $url
 * @property array<array-key, mixed>|null $payload
 * @property string|null $ip_address
 * @property string|null $user_agent
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Admin $admin
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AdminAuditLog newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AdminAuditLog newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AdminAuditLog query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AdminAuditLog whereAction($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AdminAuditLog whereAdminId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AdminAuditLog whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AdminAuditLog whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AdminAuditLog whereIpAddress($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AdminAuditLog whereMethod($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AdminAuditLog wherePayload($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AdminAuditLog whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AdminAuditLog whereUrl($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AdminAuditLog whereUserAgent($value)
 */
	class AdminAuditLog extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $user_id
 * @property int|null $profile_id
 * @property string|null $profile_type
 * @property int $breed_id
 * @property string $type
 * @property string $title
 * @property string $slug
 * @property string|null $featured_image_path
 * @property string $description
 * @property numeric|null $price
 * @property numeric|null $price_min
 * @property numeric|null $price_max
 * @property string|null $age
 * @property string|null $gender
 * @property int $kci_registered
 * @property bool $is_champion
 * @property int $awards_count
 * @property string|null $sire_name
 * @property string|null $dam_name
 * @property string|null $stud_dog_name
 * @property int $state_id
 * @property int $city_id
 * @property bool $is_available
 * @property bool $is_approved
 * @property bool $is_featured
 * @property int|null $featured_position
 * @property \Illuminate\Support\Carbon|null $featured_until
 * @property string $status
 * @property bool $is_negotiable
 * @property bool $is_vaccinated
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Breed $breed
 * @property-read \App\Models\City $city
 * @property-read string|null $featured_image_url
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\PuppyHealthRecord> $healthRecords
 * @property-read int|null $health_records_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\AdoptionImage> $images
 * @property-read int|null $images_count
 * @property-read \Illuminate\Database\Eloquent\Model|\Eloquent|null $profile
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Review> $reviews
 * @property-read int|null $reviews_count
 * @property-read \App\Models\State $state
 * @property-read \App\Models\User $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Adoption newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Adoption newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Adoption query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Adoption whereAge($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Adoption whereAwardsCount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Adoption whereBreedId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Adoption whereCityId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Adoption whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Adoption whereDamName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Adoption whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Adoption whereFeaturedImagePath($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Adoption whereFeaturedPosition($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Adoption whereFeaturedUntil($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Adoption whereGender($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Adoption whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Adoption whereIsApproved($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Adoption whereIsAvailable($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Adoption whereIsChampion($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Adoption whereIsFeatured($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Adoption whereIsNegotiable($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Adoption whereIsVaccinated($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Adoption whereKciRegistered($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Adoption wherePrice($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Adoption wherePriceMax($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Adoption wherePriceMin($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Adoption whereProfileId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Adoption whereProfileType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Adoption whereSireName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Adoption whereSlug($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Adoption whereStateId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Adoption whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Adoption whereStudDogName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Adoption whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Adoption whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Adoption whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Adoption whereUserId($value)
 */
	class Adoption extends \Eloquent {}
}

namespace App\Models{
/**
 * @property-read \App\Models\Adoption|null $adoption
 * @property-read string $image_url
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AdoptionImage newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AdoptionImage newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AdoptionImage query()
 */
	class AdoptionImage extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $pet_id
 * @property int|null $vet_profile_id
 * @property string $appointment_type
 * @property \Illuminate\Support\Carbon $appointment_date
 * @property string|null $doctor_name
 * @property string|null $clinic_name
 * @property string|null $notes
 * @property string $status
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read mixed $title
 * @property-read \App\Models\Pet $pet
 * @property-read \App\Models\VetProfile|null $vetProfile
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Appointment newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Appointment newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Appointment query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Appointment whereAppointmentDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Appointment whereAppointmentType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Appointment whereClinicName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Appointment whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Appointment whereDoctorName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Appointment whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Appointment whereNotes($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Appointment wherePetId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Appointment whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Appointment whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Appointment whereVetProfileId($value)
 */
	class Appointment extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $title
 * @property string $slug
 * @property string|null $excerpt
 * @property string $content
 * @property string|null $featured_image
 * @property string|null $author_name
 * @property int|null $category_id
 * @property int|null $user_id
 * @property string|null $meta_title
 * @property string|null $meta_description
 * @property bool $is_published
 * @property bool $is_featured
 * @property \Illuminate\Support\Carbon|null $published_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\ArticleCategory|null $category
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\ArticleGallery> $gallery
 * @property-read int|null $gallery_count
 * @property-read mixed $featured_image_url
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\User> $savedByUsers
 * @property-read int|null $saved_by_users_count
 * @property-read \App\Models\User|null $user
 * @method static \Database\Factories\ArticleFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Article newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Article newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Article query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Article whereAuthorName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Article whereCategoryId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Article whereContent($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Article whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Article whereExcerpt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Article whereFeaturedImage($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Article whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Article whereIsFeatured($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Article whereIsPublished($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Article whereMetaDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Article whereMetaTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Article wherePublishedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Article whereSlug($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Article whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Article whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Article whereUserId($value)
 */
	class Article extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $name
 * @property string $slug
 * @property bool $is_active
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Article> $articles
 * @property-read int|null $articles_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ArticleCategory newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ArticleCategory newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ArticleCategory query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ArticleCategory whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ArticleCategory whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ArticleCategory whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ArticleCategory whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ArticleCategory whereSlug($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ArticleCategory whereUpdatedAt($value)
 */
	class ArticleCategory extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $article_id
 * @property string $image_path
 * @property int $sort_order
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Article $article
 * @property-read mixed $url
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ArticleGallery newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ArticleGallery newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ArticleGallery query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ArticleGallery whereArticleId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ArticleGallery whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ArticleGallery whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ArticleGallery whereImagePath($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ArticleGallery whereSortOrder($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ArticleGallery whereUpdatedAt($value)
 */
	class ArticleGallery extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $name
 * @property string|null $description
 * @property string|null $icon_path
 * @property string|null $criteria
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\User> $users
 * @property-read int|null $users_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Badge newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Badge newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Badge query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Badge whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Badge whereCriteria($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Badge whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Badge whereIconPath($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Badge whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Badge whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Badge whereUpdatedAt($value)
 */
	class Badge extends \Eloquent {}
}

namespace App\Models{
/**
 * @property-read \App\Models\BoardingProfile|null $boardingProfile
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BoardingGallery newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BoardingGallery newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BoardingGallery query()
 */
	class BoardingGallery extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int|null $user_id
 * @property string $type
 * @property string $name
 * @property string $slug
 * @property string|null $description
 * @property string $phone
 * @property string|null $email
 * @property string|null $website
 * @property int|null $experience_years
 * @property string|null $service_type
 * @property numeric|null $price_per_day
 * @property int|null $capacity
 * @property int $state_id
 * @property int $city_id
 * @property string $address
 * @property string|null $logo
 * @property string|null $facebook_url
 * @property string|null $instagram_url
 * @property string|null $twitter_url
 * @property string|null $youtube_url
 * @property int $is_verified
 * @property int $is_active
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property int|null $agent_id
 * @property string|null $claimed_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\AdPlacement> $adPlacements
 * @property-read int|null $ad_placements_count
 * @property-read \App\Models\Admin|null $agent
 * @property-read \App\Models\City $city
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\BoardingGallery> $gallery
 * @property-read int|null $gallery_count
 * @property-read mixed $logo_url
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\BoardingReservation> $reservations
 * @property-read int|null $reservations_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Review> $reviews
 * @property-read int|null $reviews_count
 * @property-read \App\Models\State $state
 * @property-read \App\Models\User|null $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BoardingProfile newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BoardingProfile newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BoardingProfile query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BoardingProfile whereAddress($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BoardingProfile whereAgentId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BoardingProfile whereCapacity($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BoardingProfile whereCityId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BoardingProfile whereClaimedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BoardingProfile whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BoardingProfile whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BoardingProfile whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BoardingProfile whereExperienceYears($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BoardingProfile whereFacebookUrl($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BoardingProfile whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BoardingProfile whereInstagramUrl($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BoardingProfile whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BoardingProfile whereIsVerified($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BoardingProfile whereLogo($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BoardingProfile whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BoardingProfile wherePhone($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BoardingProfile wherePricePerDay($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BoardingProfile whereServiceType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BoardingProfile whereSlug($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BoardingProfile whereStateId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BoardingProfile whereTwitterUrl($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BoardingProfile whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BoardingProfile whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BoardingProfile whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BoardingProfile whereWebsite($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BoardingProfile whereYoutubeUrl($value)
 */
	class BoardingProfile extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $pet_id
 * @property int $boarding_profile_id
 * @property \Illuminate\Support\Carbon $check_in_date
 * @property \Illuminate\Support\Carbon $check_out_date
 * @property string|null $notes
 * @property string $status
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\BoardingProfile $boardingProfile
 * @property-read \App\Models\Pet $pet
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BoardingReservation newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BoardingReservation newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BoardingReservation query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BoardingReservation whereBoardingProfileId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BoardingReservation whereCheckInDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BoardingReservation whereCheckOutDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BoardingReservation whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BoardingReservation whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BoardingReservation whereNotes($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BoardingReservation wherePetId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BoardingReservation whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BoardingReservation whereUpdatedAt($value)
 */
	class BoardingReservation extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $provider_type
 * @property int $provider_id
 * @property int $user_id
 * @property \Illuminate\Support\Carbon $start_time
 * @property \Illuminate\Support\Carbon $end_time
 * @property string $status
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Model|\Eloquent $provider
 * @property-read \App\Models\User|null $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Booking newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Booking newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Booking query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Booking whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Booking whereEndTime($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Booking whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Booking whereProviderId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Booking whereProviderType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Booking whereStartTime($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Booking whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Booking whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Booking whereUserId($value)
 */
	class Booking extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $name
 * @property string $slug
 * @property string|null $description
 * @property string|null $history
 * @property string|null $other_names
 * @property string|null $naming
 * @property string|null $variants
 * @property string|null $appearance
 * @property string|null $health
 * @property string|null $temperament
 * @property string|null $behavior
 * @property string|null $intelligence
 * @property string|null $use
 * @property string|null $origin
 * @property string|null $life_span
 * @property string|null $male_height
 * @property string|null $female_height
 * @property string|null $male_weight
 * @property string|null $female_weight
 * @property string $size
 * @property string|null $breed_group
 * @property string|null $coat_type
 * @property string|null $colors
 * @property string|null $energy_level
 * @property bool $is_indian
 * @property string|null $image
 * @property bool $is_active
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Database\Factories\BreedFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Breed newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Breed newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Breed query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Breed whereAppearance($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Breed whereBehavior($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Breed whereBreedGroup($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Breed whereCoatType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Breed whereColors($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Breed whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Breed whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Breed whereEnergyLevel($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Breed whereFemaleHeight($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Breed whereFemaleWeight($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Breed whereHealth($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Breed whereHistory($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Breed whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Breed whereImage($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Breed whereIntelligence($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Breed whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Breed whereIsIndian($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Breed whereLifeSpan($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Breed whereMaleHeight($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Breed whereMaleWeight($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Breed whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Breed whereNaming($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Breed whereOrigin($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Breed whereOtherNames($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Breed whereSize($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Breed whereSlug($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Breed whereTemperament($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Breed whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Breed whereUse($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Breed whereVariants($value)
 */
	class Breed extends \Eloquent {}
}

namespace App\Models{
/**
 * @property-read \App\Models\BreederProfile|null $breederProfile
 * @property-read string|null $image_url
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BreederGallery newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BreederGallery newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BreederGallery query()
 */
	class BreederGallery extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int|null $user_id
 * @property string $type
 * @property string $name
 * @property string $slug
 * @property string|null $description
 * @property string $phone
 * @property string|null $email
 * @property string|null $website
 * @property int|null $experience_years
 * @property string|null $service_type
 * @property numeric|null $price_per_day
 * @property int|null $capacity
 * @property int $state_id
 * @property int $city_id
 * @property string $address
 * @property string|null $logo
 * @property string|null $facebook_url
 * @property string|null $instagram_url
 * @property string|null $twitter_url
 * @property string|null $youtube_url
 * @property bool $is_verified
 * @property bool $is_active
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property int|null $agent_id
 * @property string|null $claimed_at
 * @property-read \App\Models\Admin|null $agent
 * @property-read \App\Models\City $city
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\BreederGallery> $gallery
 * @property-read int|null $gallery_count
 * @property mixed $kennel_name
 * @property-read string|null $logo_url
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Litter> $litters
 * @property-read int|null $litters_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Review> $reviews
 * @property-read int|null $reviews_count
 * @property-read \App\Models\State $state
 * @property-read \App\Models\User|null $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BreederProfile newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BreederProfile newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BreederProfile query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BreederProfile whereAddress($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BreederProfile whereAgentId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BreederProfile whereCapacity($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BreederProfile whereCityId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BreederProfile whereClaimedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BreederProfile whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BreederProfile whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BreederProfile whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BreederProfile whereExperienceYears($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BreederProfile whereFacebookUrl($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BreederProfile whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BreederProfile whereInstagramUrl($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BreederProfile whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BreederProfile whereIsVerified($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BreederProfile whereLogo($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BreederProfile whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BreederProfile wherePhone($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BreederProfile wherePricePerDay($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BreederProfile whereServiceType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BreederProfile whereSlug($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BreederProfile whereStateId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BreederProfile whereTwitterUrl($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BreederProfile whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BreederProfile whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BreederProfile whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BreederProfile whereWebsite($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BreederProfile whereYoutubeUrl($value)
 */
	class BreederProfile extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $career_position_id
 * @property string $full_name
 * @property string $email
 * @property string $phone
 * @property string|null $cover_letter
 * @property string $resume_path
 * @property int|null $experience_years
 * @property string|null $current_company
 * @property string|null $linkedin_url
 * @property string|null $portfolio_url
 * @property string $status
 * @property string|null $admin_notes
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read string|null $resume_url
 * @property-read \App\Models\CareerPosition $position
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CareerApplication newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CareerApplication newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CareerApplication query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CareerApplication whereAdminNotes($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CareerApplication whereCareerPositionId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CareerApplication whereCoverLetter($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CareerApplication whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CareerApplication whereCurrentCompany($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CareerApplication whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CareerApplication whereExperienceYears($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CareerApplication whereFullName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CareerApplication whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CareerApplication whereLinkedinUrl($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CareerApplication wherePhone($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CareerApplication wherePortfolioUrl($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CareerApplication whereResumePath($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CareerApplication whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CareerApplication whereUpdatedAt($value)
 */
	class CareerApplication extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $title
 * @property string $department
 * @property string $location
 * @property string $type
 * @property string $description
 * @property string|null $requirements
 * @property bool $is_active
 * @property int $sort_order
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\CareerApplication> $applications
 * @property-read int|null $applications_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CareerPosition active()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CareerPosition newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CareerPosition newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CareerPosition query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CareerPosition whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CareerPosition whereDepartment($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CareerPosition whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CareerPosition whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CareerPosition whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CareerPosition whereLocation($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CareerPosition whereRequirements($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CareerPosition whereSortOrder($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CareerPosition whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CareerPosition whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CareerPosition whereUpdatedAt($value)
 */
	class CareerPosition extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $state_id
 * @property string $name
 * @property numeric|null $latitude
 * @property numeric|null $longitude
 * @property string|null $slug
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\State $state
 * @method static \Illuminate\Database\Eloquent\Builder<static>|City newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|City newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|City query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|City whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|City whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|City whereLatitude($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|City whereLongitude($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|City whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|City whereSlug($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|City whereStateId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|City whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|City withinDistance(float $lat, float $lng, int $radius = 25)
 */
	class City extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $name
 * @property string $email
 * @property string $subject
 * @property string $message
 * @property string $status
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ContactMessage newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ContactMessage newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ContactMessage query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ContactMessage whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ContactMessage whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ContactMessage whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ContactMessage whereMessage($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ContactMessage whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ContactMessage whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ContactMessage whereSubject($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ContactMessage whereUpdatedAt($value)
 */
	class ContactMessage extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Message|null $latestMessage
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Message> $messages
 * @property-read int|null $messages_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\User> $users
 * @property-read int|null $users_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Conversation newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Conversation newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Conversation query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Conversation whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Conversation whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Conversation whereUpdatedAt($value)
 */
	class Conversation extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int|null $user_id
 * @property string $type
 * @property string $name
 * @property string $slug
 * @property string|null $description
 * @property string $phone
 * @property string|null $email
 * @property string|null $website
 * @property int|null $experience_years
 * @property string|null $service_type
 * @property numeric|null $price_per_day
 * @property int|null $capacity
 * @property int $state_id
 * @property int $city_id
 * @property string $address
 * @property string|null $logo
 * @property string|null $facebook_url
 * @property string|null $instagram_url
 * @property string|null $twitter_url
 * @property string|null $youtube_url
 * @property int $is_verified
 * @property int $is_active
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property int|null $agent_id
 * @property string|null $claimed_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\AdPlacement> $adPlacements
 * @property-read int|null $ad_placements_count
 * @property-read \App\Models\Admin|null $agent
 * @property-read \App\Models\City $city
 * @property-read mixed $logo_url
 * @property-read \App\Models\State $state
 * @property-read \App\Models\User|null $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DirectoryProfile newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DirectoryProfile newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DirectoryProfile query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DirectoryProfile whereAddress($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DirectoryProfile whereAgentId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DirectoryProfile whereCapacity($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DirectoryProfile whereCityId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DirectoryProfile whereClaimedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DirectoryProfile whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DirectoryProfile whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DirectoryProfile whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DirectoryProfile whereExperienceYears($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DirectoryProfile whereFacebookUrl($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DirectoryProfile whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DirectoryProfile whereInstagramUrl($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DirectoryProfile whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DirectoryProfile whereIsVerified($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DirectoryProfile whereLogo($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DirectoryProfile whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DirectoryProfile wherePhone($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DirectoryProfile wherePricePerDay($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DirectoryProfile whereServiceType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DirectoryProfile whereSlug($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DirectoryProfile whereStateId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DirectoryProfile whereTwitterUrl($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DirectoryProfile whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DirectoryProfile whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DirectoryProfile whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DirectoryProfile whereWebsite($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DirectoryProfile whereYoutubeUrl($value)
 */
	class DirectoryProfile extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $title
 * @property string $slug
 * @property string|null $description
 * @property int $event_type_id
 * @property \Illuminate\Support\Carbon $start_date
 * @property \Illuminate\Support\Carbon|null $end_date
 * @property string|null $start_time
 * @property int $state_id
 * @property int $city_id
 * @property string $venue_name
 * @property string $address
 * @property string|null $organizer_name
 * @property string|null $contact_phone
 * @property string|null $contact_email
 * @property string|null $banner_image
 * @property bool $is_featured
 * @property bool $is_active
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\User> $attendees
 * @property-read int|null $attendees_count
 * @property-read \App\Models\City $city
 * @property-read \App\Models\EventType $eventType
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\EventGallery> $gallery
 * @property-read int|null $gallery_count
 * @property-read mixed $banner_url
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\EventRegistration> $registrations
 * @property-read int|null $registrations_count
 * @property-read \App\Models\State $state
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Event newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Event newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Event query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Event whereAddress($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Event whereBannerImage($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Event whereCityId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Event whereContactEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Event whereContactPhone($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Event whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Event whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Event whereEndDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Event whereEventTypeId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Event whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Event whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Event whereIsFeatured($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Event whereOrganizerName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Event whereSlug($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Event whereStartDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Event whereStartTime($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Event whereStateId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Event whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Event whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Event whereVenueName($value)
 */
	class Event extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $event_id
 * @property string $image_path
 * @property int $sort_order
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Event $event
 * @property-read mixed $url
 * @method static \Illuminate\Database\Eloquent\Builder<static>|EventGallery newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|EventGallery newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|EventGallery query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|EventGallery whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|EventGallery whereEventId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|EventGallery whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|EventGallery whereImagePath($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|EventGallery whereSortOrder($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|EventGallery whereUpdatedAt($value)
 */
	class EventGallery extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $event_id
 * @property int $user_id
 * @property string $status
 * @property string|null $notes
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Event $event
 * @property-read \App\Models\User $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|EventRegistration newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|EventRegistration newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|EventRegistration query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|EventRegistration whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|EventRegistration whereEventId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|EventRegistration whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|EventRegistration whereNotes($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|EventRegistration whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|EventRegistration whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|EventRegistration whereUserId($value)
 */
	class EventRegistration extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $name
 * @property string $slug
 * @property bool $is_active
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Event> $events
 * @property-read int|null $events_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|EventType newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|EventType newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|EventType query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|EventType whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|EventType whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|EventType whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|EventType whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|EventType whereSlug($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|EventType whereUpdatedAt($value)
 */
	class EventType extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $name
 * @property string $slug
 * @property string|null $description
 * @property string|null $icon
 * @property int $sort_order
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\ForumThread> $threads
 * @property-read int|null $threads_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ForumCategory newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ForumCategory newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ForumCategory query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ForumCategory whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ForumCategory whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ForumCategory whereIcon($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ForumCategory whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ForumCategory whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ForumCategory whereSlug($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ForumCategory whereSortOrder($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ForumCategory whereUpdatedAt($value)
 */
	class ForumCategory extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $forum_thread_id
 * @property int $user_id
 * @property string $body
 * @property int $is_best_answer
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\ForumThread $thread
 * @property-read \App\Models\User $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ForumReply newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ForumReply newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ForumReply query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ForumReply whereBody($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ForumReply whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ForumReply whereForumThreadId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ForumReply whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ForumReply whereIsBestAnswer($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ForumReply whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ForumReply whereUserId($value)
 */
	class ForumReply extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $user_id
 * @property int $forum_category_id
 * @property string $title
 * @property string $slug
 * @property string $body
 * @property int $is_pinned
 * @property int $is_locked
 * @property int $view_count
 * @property int $reply_count
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\ForumCategory $category
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\ForumReply> $replies
 * @property-read int|null $replies_count
 * @property-read \App\Models\User $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ForumThread newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ForumThread newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ForumThread query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ForumThread whereBody($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ForumThread whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ForumThread whereForumCategoryId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ForumThread whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ForumThread whereIsLocked($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ForumThread whereIsPinned($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ForumThread whereReplyCount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ForumThread whereSlug($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ForumThread whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ForumThread whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ForumThread whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ForumThread whereViewCount($value)
 */
	class ForumThread extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int|null $user_id
 * @property string|null $title
 * @property string|null $slug
 * @property string|null $description
 * @property string|null $image
 * @property int|null $category_id
 * @property int|null $state_id
 * @property int|null $city_id
 * @property bool $is_featured
 * @property bool $is_active
 * @property int $shares_count
 * @property int $exports_count
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\GalleryCategory|null $category
 * @property-read \App\Models\City|null $city
 * @property-read mixed $main_image_url
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\GalleryImage> $images
 * @property-read int|null $images_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\GalleryLike> $likes
 * @property-read int|null $likes_count
 * @property-read \App\Models\State|null $state
 * @property-read \App\Models\User|null $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Gallery newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Gallery newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Gallery query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Gallery whereCategoryId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Gallery whereCityId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Gallery whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Gallery whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Gallery whereExportsCount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Gallery whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Gallery whereImage($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Gallery whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Gallery whereIsFeatured($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Gallery whereSharesCount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Gallery whereSlug($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Gallery whereStateId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Gallery whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Gallery whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Gallery whereUserId($value)
 */
	class Gallery extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $name
 * @property string $slug
 * @property string|null $description
 * @property bool $is_active
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Gallery> $galleries
 * @property-read int|null $galleries_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|GalleryCategory newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|GalleryCategory newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|GalleryCategory query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|GalleryCategory whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|GalleryCategory whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|GalleryCategory whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|GalleryCategory whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|GalleryCategory whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|GalleryCategory whereSlug($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|GalleryCategory whereUpdatedAt($value)
 */
	class GalleryCategory extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $gallery_id
 * @property string $image_path
 * @property string|null $caption
 * @property int $sort_order
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Gallery $gallery
 * @property-read mixed $url
 * @method static \Illuminate\Database\Eloquent\Builder<static>|GalleryImage newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|GalleryImage newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|GalleryImage query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|GalleryImage whereCaption($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|GalleryImage whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|GalleryImage whereGalleryId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|GalleryImage whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|GalleryImage whereImagePath($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|GalleryImage whereSortOrder($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|GalleryImage whereUpdatedAt($value)
 */
	class GalleryImage extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $gallery_id
 * @property int|null $user_id
 * @property string|null $ip_address
 * @property string|null $session_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Gallery $gallery
 * @property-read \App\Models\User|null $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|GalleryLike newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|GalleryLike newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|GalleryLike query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|GalleryLike whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|GalleryLike whereGalleryId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|GalleryLike whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|GalleryLike whereIpAddress($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|GalleryLike whereSessionId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|GalleryLike whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|GalleryLike whereUserId($value)
 */
	class GalleryLike extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $support_ticket_id
 * @property int|null $admin_id
 * @property string $message
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Admin|null $admin
 * @property-read \App\Models\SupportTicket $ticket
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InternalNote newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InternalNote newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InternalNote query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InternalNote whereAdminId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InternalNote whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InternalNote whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InternalNote whereMessage($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InternalNote whereSupportTicketId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InternalNote whereUpdatedAt($value)
 */
	class InternalNote extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $admin_id
 * @property int|null $assigned_to
 * @property \Illuminate\Support\Carbon|null $escalated_at
 * @property \Illuminate\Support\Carbon|null $returned_at
 * @property \Illuminate\Support\Carbon|null $transferred_at
 * @property string $subject
 * @property string $priority
 * @property string $status
 * @property string $message
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Admin $admin
 * @property-read \App\Models\Admin|null $assignedTo
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\InternalTicketReply> $replies
 * @property-read int|null $replies_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InternalTicket needsAttention()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InternalTicket newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InternalTicket newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InternalTicket query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InternalTicket whereAdminId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InternalTicket whereAssignedTo($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InternalTicket whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InternalTicket whereEscalatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InternalTicket whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InternalTicket whereMessage($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InternalTicket wherePriority($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InternalTicket whereReturnedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InternalTicket whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InternalTicket whereSubject($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InternalTicket whereTransferredAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InternalTicket whereUpdatedAt($value)
 */
	class InternalTicket extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $internal_ticket_id
 * @property int $admin_id
 * @property string $message
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Admin $admin
 * @property-read \App\Models\InternalTicket $ticket
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InternalTicketReply newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InternalTicketReply newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InternalTicketReply query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InternalTicketReply whereAdminId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InternalTicketReply whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InternalTicketReply whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InternalTicketReply whereInternalTicketId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InternalTicketReply whereMessage($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InternalTicketReply whereUpdatedAt($value)
 */
	class InternalTicketReply extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $user_id
 * @property int|null $profile_id
 * @property string|null $profile_type
 * @property int $breed_id
 * @property string $type
 * @property string $title
 * @property string $slug
 * @property string|null $featured_image_path
 * @property string $description
 * @property numeric|null $price
 * @property numeric|null $price_min
 * @property numeric|null $price_max
 * @property string|null $age
 * @property string|null $gender
 * @property bool $kci_registered
 * @property bool $is_champion
 * @property int $awards_count
 * @property string|null $sire_name
 * @property string|null $dam_name
 * @property string|null $stud_dog_name
 * @property int $state_id
 * @property int $city_id
 * @property bool $is_available
 * @property bool $is_approved
 * @property bool $is_featured
 * @property int|null $featured_position
 * @property \Illuminate\Support\Carbon|null $featured_until
 * @property string $status
 * @property bool $is_negotiable
 * @property bool $is_vaccinated
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Breed $breed
 * @property-read \App\Models\City $city
 * @property-read string|null $featured_image_url
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\LitterImage> $images
 * @property-read int|null $images_count
 * @property-read \Illuminate\Database\Eloquent\Model|\Eloquent|null $profile
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\PuppyHealthRecord> $puppyHealthRecords
 * @property-read int|null $puppy_health_records_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Review> $reviews
 * @property-read int|null $reviews_count
 * @property-read \App\Models\State $state
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\TransferRequest> $transferRequests
 * @property-read int|null $transfer_requests_count
 * @property-read \App\Models\User $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Litter newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Litter newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Litter query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Litter whereAge($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Litter whereAwardsCount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Litter whereBreedId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Litter whereCityId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Litter whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Litter whereDamName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Litter whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Litter whereFeaturedImagePath($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Litter whereFeaturedPosition($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Litter whereFeaturedUntil($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Litter whereGender($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Litter whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Litter whereIsApproved($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Litter whereIsAvailable($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Litter whereIsChampion($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Litter whereIsFeatured($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Litter whereIsNegotiable($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Litter whereIsVaccinated($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Litter whereKciRegistered($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Litter wherePrice($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Litter wherePriceMax($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Litter wherePriceMin($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Litter whereProfileId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Litter whereProfileType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Litter whereSireName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Litter whereSlug($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Litter whereStateId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Litter whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Litter whereStudDogName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Litter whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Litter whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Litter whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Litter whereUserId($value)
 */
	class Litter extends \Eloquent {}
}

namespace App\Models{
/**
 * @property-read string|null $image_url
 * @property-read \App\Models\Litter|null $litter
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LitterImage newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LitterImage newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LitterImage query()
 */
	class LitterImage extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $pet_id
 * @property string $record_type
 * @property string $title
 * @property string|null $description
 * @property \Illuminate\Support\Carbon|null $diagnosis_date
 * @property string|null $doctor_name
 * @property string|null $clinic_name
 * @property string|null $prescription
 * @property string|null $notes
 * @property array<array-key, mixed>|null $metadata
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Pet $pet
 * @method static \Database\Factories\MedicalRecordFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MedicalRecord newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MedicalRecord newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MedicalRecord query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MedicalRecord whereClinicName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MedicalRecord whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MedicalRecord whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MedicalRecord whereDiagnosisDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MedicalRecord whereDoctorName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MedicalRecord whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MedicalRecord whereMetadata($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MedicalRecord whereNotes($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MedicalRecord wherePetId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MedicalRecord wherePrescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MedicalRecord whereRecordType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MedicalRecord whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MedicalRecord whereUpdatedAt($value)
 */
	class MedicalRecord extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $conversation_id
 * @property int $user_id
 * @property string|null $body
 * @property \Illuminate\Support\Carbon|null $read_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\MessageAttachment> $attachments
 * @property-read int|null $attachments_count
 * @property-read \App\Models\Conversation $conversation
 * @property-read \App\Models\User $sender
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Message newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Message newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Message query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Message whereBody($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Message whereConversationId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Message whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Message whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Message whereReadAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Message whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Message whereUserId($value)
 */
	class Message extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $message_id
 * @property string $file_path
 * @property string $file_name
 * @property string $mime_type
 * @property int $size
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Message $message
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MessageAttachment newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MessageAttachment newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MessageAttachment query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MessageAttachment whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MessageAttachment whereFileName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MessageAttachment whereFilePath($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MessageAttachment whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MessageAttachment whereMessageId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MessageAttachment whereMimeType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MessageAttachment whereSize($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MessageAttachment whereUpdatedAt($value)
 */
	class MessageAttachment extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $email
 * @property string|null $name
 * @property string $token
 * @property \Illuminate\Support\Carbon $subscribed_at
 * @property \Illuminate\Support\Carbon|null $unsubscribed_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder<static>|NewsletterSubscriber active()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|NewsletterSubscriber newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|NewsletterSubscriber newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|NewsletterSubscriber query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|NewsletterSubscriber whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|NewsletterSubscriber whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|NewsletterSubscriber whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|NewsletterSubscriber whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|NewsletterSubscriber whereSubscribedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|NewsletterSubscriber whereToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|NewsletterSubscriber whereUnsubscribedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|NewsletterSubscriber whereUpdatedAt($value)
 */
	class NewsletterSubscriber extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $user_id
 * @property string $type
 * @property string $title
 * @property string $message
 * @property bool $is_read
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Notification newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Notification newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Notification query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Notification unread()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Notification whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Notification whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Notification whereIsRead($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Notification whereMessage($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Notification whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Notification whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Notification whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Notification whereUserId($value)
 */
	class Notification extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $admin_id
 * @property numeric $amount
 * @property string $type
 * @property string $status
 * @property \Illuminate\Support\Carbon $period_start
 * @property \Illuminate\Support\Carbon $period_end
 * @property \Illuminate\Support\Carbon|null $paid_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property int|null $assigned_to
 * @property-read \App\Models\Admin $admin
 * @property-read \App\Models\Admin|null $assignedTo
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Payout newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Payout newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Payout query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Payout whereAdminId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Payout whereAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Payout whereAssignedTo($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Payout whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Payout whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Payout wherePaidAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Payout wherePeriodEnd($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Payout wherePeriodStart($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Payout whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Payout whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Payout whereUpdatedAt($value)
 */
	class Payout extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $user_id
 * @property int $breed_id
 * @property string $name
 * @property string $gender
 * @property \Illuminate\Support\Carbon|null $date_of_birth
 * @property string|null $color
 * @property string|null $microchip_number
 * @property string|null $passport_number
 * @property bool $is_champion
 * @property int $transfer_count
 * @property int $sale_count
 * @property int $adoption_count
 * @property bool $is_lost
 * @property \Illuminate\Support\Carbon|null $lost_at
 * @property string|null $lost_description
 * @property string|null $lost_location
 * @property string|null $emergency_contact_name
 * @property string|null $emergency_contact_phone
 * @property string|null $emergency_contact_email
 * @property int $awards_count
 * @property string|null $profile_image_path
 * @property string|null $notes
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property int|null $sire_id
 * @property int|null $dam_id
 * @property numeric|null $lost_lat
 * @property numeric|null $lost_lng
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\BoardingReservation> $boardingReservations
 * @property-read int|null $boarding_reservations_count
 * @property-read \App\Models\Breed $breed
 * @property-read Pet|null $dam
 * @property-read array $badges
 * @property-read string|null $profile_image_url
 * @property-read string $vaccination_expiry_status
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\MedicalRecord> $medicalRecords
 * @property-read int|null $medical_records_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, Pet> $offspringAsDam
 * @property-read int|null $offspring_as_dam_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, Pet> $offspringAsSire
 * @property-read int|null $offspring_as_sire_count
 * @property-read Pet|null $sire
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\TrainingSession> $trainingSessions
 * @property-read int|null $training_sessions_count
 * @property-read \App\Models\User $user
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Vaccination> $vaccinations
 * @property-read int|null $vaccinations_count
 * @method static \Database\Factories\PetFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pet newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pet newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pet query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pet whereAdoptionCount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pet whereAwardsCount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pet whereBreedId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pet whereColor($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pet whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pet whereDamId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pet whereDateOfBirth($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pet whereEmergencyContactEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pet whereEmergencyContactName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pet whereEmergencyContactPhone($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pet whereGender($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pet whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pet whereIsChampion($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pet whereIsLost($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pet whereLostAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pet whereLostDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pet whereLostLat($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pet whereLostLng($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pet whereLostLocation($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pet whereMicrochipNumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pet whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pet whereNotes($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pet wherePassportNumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pet whereProfileImagePath($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pet whereSaleCount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pet whereSireId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pet whereTransferCount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pet whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pet whereUserId($value)
 */
	class Pet extends \Eloquent {}
}

namespace App\Models{
/**
 * @property-read \App\Models\PetShopProfile|null $profile
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PetShopGallery newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PetShopGallery newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PetShopGallery query()
 */
	class PetShopGallery extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int|null $user_id
 * @property string $type
 * @property string $name
 * @property string $slug
 * @property string|null $description
 * @property string $phone
 * @property string|null $email
 * @property string|null $website
 * @property int|null $experience_years
 * @property string|null $service_type
 * @property numeric|null $price_per_day
 * @property int|null $capacity
 * @property int $state_id
 * @property int $city_id
 * @property string $address
 * @property string|null $logo
 * @property string|null $facebook_url
 * @property string|null $instagram_url
 * @property string|null $twitter_url
 * @property string|null $youtube_url
 * @property bool $is_verified
 * @property bool $is_active
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property int|null $agent_id
 * @property string|null $claimed_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\AdPlacement> $adPlacements
 * @property-read int|null $ad_placements_count
 * @property-read \App\Models\Admin|null $agent
 * @property-read \App\Models\City $city
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\PetShopGallery> $gallery
 * @property-read int|null $gallery_count
 * @property-read mixed $logo_url
 * @property mixed $shop_name
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Review> $reviews
 * @property-read int|null $reviews_count
 * @property-read \App\Models\State $state
 * @property-read \App\Models\User|null $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PetShopProfile newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PetShopProfile newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PetShopProfile query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PetShopProfile whereAddress($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PetShopProfile whereAgentId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PetShopProfile whereCapacity($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PetShopProfile whereCityId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PetShopProfile whereClaimedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PetShopProfile whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PetShopProfile whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PetShopProfile whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PetShopProfile whereExperienceYears($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PetShopProfile whereFacebookUrl($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PetShopProfile whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PetShopProfile whereInstagramUrl($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PetShopProfile whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PetShopProfile whereIsVerified($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PetShopProfile whereLogo($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PetShopProfile whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PetShopProfile wherePhone($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PetShopProfile wherePricePerDay($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PetShopProfile whereServiceType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PetShopProfile whereSlug($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PetShopProfile whereStateId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PetShopProfile whereTwitterUrl($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PetShopProfile whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PetShopProfile whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PetShopProfile whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PetShopProfile whereWebsite($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PetShopProfile whereYoutubeUrl($value)
 */
	class PetShopProfile extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $viewable_type
 * @property int $viewable_id
 * @property string|null $ip_address
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Model|\Eloquent $viewable
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProfileView newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProfileView newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProfileView query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProfileView whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProfileView whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProfileView whereIpAddress($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProfileView whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProfileView whereViewableId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProfileView whereViewableType($value)
 */
	class ProfileView extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $provider_type
 * @property int $provider_id
 * @property int $day_of_week
 * @property string $start_time
 * @property string $end_time
 * @property int $slot_duration_minutes
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Model|\Eloquent $provider
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProviderAvailability newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProviderAvailability newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProviderAvailability query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProviderAvailability whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProviderAvailability whereDayOfWeek($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProviderAvailability whereEndTime($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProviderAvailability whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProviderAvailability whereProviderId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProviderAvailability whereProviderType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProviderAvailability whereSlotDurationMinutes($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProviderAvailability whereStartTime($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProviderAvailability whereUpdatedAt($value)
 */
	class ProviderAvailability extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int|null $litter_id
 * @property int|null $adoption_id
 * @property string $record_type
 * @property string $title
 * @property string|null $description
 * @property \Illuminate\Support\Carbon $administered_date
 * @property \Illuminate\Support\Carbon|null $next_due_date
 * @property string|null $vet_name
 * @property string|null $notes
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Adoption|null $adoption
 * @property-read \App\Models\Litter|null $litter
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PuppyHealthRecord newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PuppyHealthRecord newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PuppyHealthRecord query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PuppyHealthRecord whereAdministeredDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PuppyHealthRecord whereAdoptionId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PuppyHealthRecord whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PuppyHealthRecord whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PuppyHealthRecord whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PuppyHealthRecord whereLitterId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PuppyHealthRecord whereNextDueDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PuppyHealthRecord whereNotes($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PuppyHealthRecord whereRecordType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PuppyHealthRecord whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PuppyHealthRecord whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PuppyHealthRecord whereVetName($value)
 */
	class PuppyHealthRecord extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $user_id
 * @property int $rating
 * @property string|null $comment
 * @property string $reviewable_type
 * @property int $reviewable_id
 * @property int $is_verified
 * @property string $status
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Model|\Eloquent $reviewable
 * @property-read \App\Models\User $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Review newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Review newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Review query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Review whereComment($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Review whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Review whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Review whereIsVerified($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Review whereRating($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Review whereReviewableId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Review whereReviewableType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Review whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Review whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Review whereUserId($value)
 */
	class Review extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $name
 * @property string $slug
 * @property string|null $description
 * @property bool $is_active
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\User> $users
 * @property-read int|null $users_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Role newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Role newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Role query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Role whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Role whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Role whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Role whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Role whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Role whereSlug($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Role whereUpdatedAt($value)
 */
	class Role extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $user_id
 * @property int $saved_item_id
 * @property string $saved_item_type
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Model|\Eloquent $savedItem
 * @property-read \App\Models\User $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SavedItem newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SavedItem newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SavedItem query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SavedItem whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SavedItem whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SavedItem whereSavedItemId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SavedItem whereSavedItemType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SavedItem whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SavedItem whereUserId($value)
 */
	class SavedItem extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $key
 * @property string $label
 * @property string|null $value
 * @property string $type
 * @property string $group
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Setting newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Setting newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Setting query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Setting whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Setting whereGroup($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Setting whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Setting whereKey($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Setting whereLabel($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Setting whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Setting whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Setting whereValue($value)
 */
	class Setting extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $name
 * @property string|null $code
 * @property string|null $slug
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\BoardingProfile> $boardingProfiles
 * @property-read int|null $boarding_profiles_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\BreederProfile> $breederProfiles
 * @property-read int|null $breeder_profiles_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\City> $cities
 * @property-read int|null $cities_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\TrainerProfile> $trainerProfiles
 * @property-read int|null $trainer_profiles_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\VetProfile> $vetProfiles
 * @property-read int|null $vet_profiles_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\WelfareProfile> $welfareProfiles
 * @property-read int|null $welfare_profiles_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|State newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|State newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|State query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|State whereCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|State whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|State whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|State whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|State whereSlug($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|State whereUpdatedAt($value)
 */
	class State extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $user_id
 * @property int|null $profile_id
 * @property string|null $profile_type
 * @property int $breed_id
 * @property string $type
 * @property string $title
 * @property string $slug
 * @property string|null $featured_image_path
 * @property string $description
 * @property numeric|null $price
 * @property numeric|null $price_min
 * @property numeric|null $price_max
 * @property string|null $age
 * @property string|null $gender
 * @property bool $kci_registered
 * @property bool $is_champion
 * @property int $awards_count
 * @property string|null $sire_name
 * @property string|null $dam_name
 * @property string|null $stud_dog_name
 * @property int $state_id
 * @property int $city_id
 * @property bool $is_available
 * @property bool $is_approved
 * @property bool $is_featured
 * @property int|null $featured_position
 * @property \Illuminate\Support\Carbon|null $featured_until
 * @property string $status
 * @property bool $is_negotiable
 * @property bool $is_vaccinated
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Breed $breed
 * @property-read \App\Models\City $city
 * @property-read string|null $featured_image_url
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\StudServiceImage> $images
 * @property-read int|null $images_count
 * @property-read \Illuminate\Database\Eloquent\Model|\Eloquent|null $profile
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Review> $reviews
 * @property-read int|null $reviews_count
 * @property-read \App\Models\State $state
 * @property-read \App\Models\User $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StudService newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StudService newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StudService query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StudService whereAge($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StudService whereAwardsCount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StudService whereBreedId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StudService whereCityId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StudService whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StudService whereDamName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StudService whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StudService whereFeaturedImagePath($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StudService whereFeaturedPosition($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StudService whereFeaturedUntil($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StudService whereGender($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StudService whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StudService whereIsApproved($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StudService whereIsAvailable($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StudService whereIsChampion($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StudService whereIsFeatured($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StudService whereIsNegotiable($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StudService whereIsVaccinated($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StudService whereKciRegistered($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StudService wherePrice($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StudService wherePriceMax($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StudService wherePriceMin($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StudService whereProfileId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StudService whereProfileType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StudService whereSireName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StudService whereSlug($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StudService whereStateId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StudService whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StudService whereStudDogName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StudService whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StudService whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StudService whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StudService whereUserId($value)
 */
	class StudService extends \Eloquent {}
}

namespace App\Models{
/**
 * @property-read \App\Models\StudService|null $studService
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StudServiceImage newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StudServiceImage newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StudServiceImage query()
 */
	class StudServiceImage extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $user_id
 * @property string $type
 * @property string $stripe_id
 * @property string $stripe_status
 * @property string|null $stripe_price
 * @property int|null $quantity
 * @property string|null $trial_ends_at
 * @property string|null $ends_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User|null $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Subscription newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Subscription newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Subscription query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Subscription whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Subscription whereEndsAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Subscription whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Subscription whereQuantity($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Subscription whereStripeId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Subscription whereStripePrice($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Subscription whereStripeStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Subscription whereTrialEndsAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Subscription whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Subscription whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Subscription whereUserId($value)
 */
	class Subscription extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $user_id
 * @property string $subject
 * @property string $category
 * @property string $priority
 * @property string $message
 * @property string $status
 * @property string|null $attachment_path
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property int|null $assigned_to
 * @property \Illuminate\Support\Carbon|null $escalated_to_hr_at
 * @property \Illuminate\Support\Carbon|null $returned_to_queue_at
 * @property \Illuminate\Support\Carbon|null $last_transferred_at
 * @property-read \App\Models\Admin|null $assignedTo
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\InternalNote> $internalNotes
 * @property-read int|null $internal_notes_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\SupportTicketReply> $replies
 * @property-read int|null $replies_count
 * @property-read \App\Models\User $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SupportTicket needsAttention()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SupportTicket newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SupportTicket newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SupportTicket query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SupportTicket whereAssignedTo($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SupportTicket whereAttachmentPath($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SupportTicket whereCategory($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SupportTicket whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SupportTicket whereEscalatedToHrAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SupportTicket whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SupportTicket whereLastTransferredAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SupportTicket whereMessage($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SupportTicket wherePriority($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SupportTicket whereReturnedToQueueAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SupportTicket whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SupportTicket whereSubject($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SupportTicket whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SupportTicket whereUserId($value)
 */
	class SupportTicket extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $support_ticket_id
 * @property int|null $user_id
 * @property int|null $admin_id
 * @property string $message
 * @property string|null $attachment_path
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Admin|null $admin
 * @property-read \App\Models\SupportTicket $ticket
 * @property-read \App\Models\User|null $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SupportTicketReply newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SupportTicketReply newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SupportTicketReply query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SupportTicketReply whereAdminId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SupportTicketReply whereAttachmentPath($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SupportTicketReply whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SupportTicketReply whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SupportTicketReply whereMessage($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SupportTicketReply whereSupportTicketId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SupportTicketReply whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SupportTicketReply whereUserId($value)
 */
	class SupportTicketReply extends \Eloquent {}
}

namespace App\Models{
/**
 * @property-read mixed $image_url
 * @property-read \App\Models\TrainerProfile|null $trainerProfile
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TrainerGallery newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TrainerGallery newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TrainerGallery query()
 */
	class TrainerGallery extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int|null $user_id
 * @property string $type
 * @property string $name
 * @property string $slug
 * @property string|null $description
 * @property string $phone
 * @property string|null $email
 * @property string|null $website
 * @property int|null $experience_years
 * @property string|null $service_type
 * @property numeric|null $price_per_day
 * @property int|null $capacity
 * @property int $state_id
 * @property int $city_id
 * @property string $address
 * @property string|null $logo
 * @property string|null $facebook_url
 * @property string|null $instagram_url
 * @property string|null $twitter_url
 * @property string|null $youtube_url
 * @property int $is_verified
 * @property int $is_active
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property int|null $agent_id
 * @property string|null $claimed_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\AdPlacement> $adPlacements
 * @property-read int|null $ad_placements_count
 * @property-read \App\Models\Admin|null $agent
 * @property-read \App\Models\City $city
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\TrainerGallery> $gallery
 * @property-read int|null $gallery_count
 * @property-read mixed $logo_url
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Review> $reviews
 * @property-read int|null $reviews_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\TrainerSpecialization> $specializations
 * @property-read int|null $specializations_count
 * @property-read \App\Models\State $state
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\TrainingSession> $trainingSessions
 * @property-read int|null $training_sessions_count
 * @property-read \App\Models\User|null $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TrainerProfile newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TrainerProfile newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TrainerProfile query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TrainerProfile whereAddress($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TrainerProfile whereAgentId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TrainerProfile whereCapacity($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TrainerProfile whereCityId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TrainerProfile whereClaimedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TrainerProfile whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TrainerProfile whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TrainerProfile whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TrainerProfile whereExperienceYears($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TrainerProfile whereFacebookUrl($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TrainerProfile whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TrainerProfile whereInstagramUrl($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TrainerProfile whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TrainerProfile whereIsVerified($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TrainerProfile whereLogo($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TrainerProfile whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TrainerProfile wherePhone($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TrainerProfile wherePricePerDay($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TrainerProfile whereServiceType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TrainerProfile whereSlug($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TrainerProfile whereStateId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TrainerProfile whereTwitterUrl($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TrainerProfile whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TrainerProfile whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TrainerProfile whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TrainerProfile whereWebsite($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TrainerProfile whereYoutubeUrl($value)
 */
	class TrainerProfile extends \Eloquent {}
}

namespace App\Models{
/**
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\TrainerProfile> $trainerProfiles
 * @property-read int|null $trainer_profiles_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TrainerSpecialization newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TrainerSpecialization newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TrainerSpecialization query()
 */
	class TrainerSpecialization extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $pet_id
 * @property int $trainer_profile_id
 * @property string $session_type
 * @property \Illuminate\Support\Carbon $session_date
 * @property string|null $notes
 * @property string $status
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read mixed $title
 * @property-read \App\Models\Pet $pet
 * @property-read \App\Models\TrainerProfile $trainerProfile
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TrainingSession newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TrainingSession newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TrainingSession query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TrainingSession whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TrainingSession whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TrainingSession whereNotes($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TrainingSession wherePetId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TrainingSession whereSessionDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TrainingSession whereSessionType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TrainingSession whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TrainingSession whereTrainerProfileId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TrainingSession whereUpdatedAt($value)
 */
	class TrainingSession extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $litter_id
 * @property int $buyer_id
 * @property int $breeder_id
 * @property string $pet_name
 * @property string $gender
 * @property \Illuminate\Support\Carbon|null $date_of_birth
 * @property string $status
 * @property array<array-key, mixed>|null $logs
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User $breeder
 * @property-read \App\Models\User $buyer
 * @property-read \App\Models\Litter $litter
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TransferRequest newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TransferRequest newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TransferRequest query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TransferRequest whereBreederId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TransferRequest whereBuyerId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TransferRequest whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TransferRequest whereDateOfBirth($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TransferRequest whereGender($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TransferRequest whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TransferRequest whereLitterId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TransferRequest whereLogs($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TransferRequest wherePetName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TransferRequest whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TransferRequest whereUpdatedAt($value)
 */
	class TransferRequest extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $name
 * @property string $email
 * @property string|null $avatar
 * @property string|null $mobile_number
 * @property int $role_id
 * @property \Illuminate\Support\Carbon|null $email_verified_at
 * @property string $password
 * @property string|null $remember_token
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property bool $is_active
 * @property \Illuminate\Support\Carbon|null $suspended_until
 * @property string|null $stripe_id
 * @property string|null $pm_type
 * @property string|null $pm_last_four
 * @property string|null $trial_ends_at
 * @property int $karma_points
 * @property int|null $state_id
 * @property int|null $city_id
 * @property numeric|null $latitude
 * @property numeric|null $longitude
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\PuppyHealthRecord> $adoptionHealthRecords
 * @property-read int|null $adoption_health_records_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Adoption> $adoptions
 * @property-read int|null $adoptions_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Appointment> $appointments
 * @property-read int|null $appointments_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Article> $articles
 * @property-read int|null $articles_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Badge> $badges
 * @property-read int|null $badges_count
 * @property-read \App\Models\BoardingProfile|null $boardingProfile
 * @property-read \App\Models\BreederProfile|null $breederProfile
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\TransferRequest> $breederTransferRequests
 * @property-read int|null $breeder_transfer_requests_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\TransferRequest> $buyerTransferRequests
 * @property-read int|null $buyer_transfer_requests_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Conversation> $conversations
 * @property-read int|null $conversations_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\EventRegistration> $eventRegistrations
 * @property-read int|null $event_registrations_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\ForumReply> $forumReplies
 * @property-read int|null $forum_replies_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\ForumThread> $forumThreads
 * @property-read int|null $forum_threads_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Gallery> $galleries
 * @property-read int|null $galleries_count
 * @property-read mixed $avatar_url
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Gallery> $likedGalleries
 * @property-read int|null $liked_galleries_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Litter> $litters
 * @property-read int|null $litters_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\MedicalRecord> $medicalRecords
 * @property-read int|null $medical_records_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Message> $messages
 * @property-read int|null $messages_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Notification> $notifications
 * @property-read int|null $notifications_count
 * @property-read \App\Models\PetShopProfile|null $petShopProfile
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Pet> $pets
 * @property-read int|null $pets_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\PuppyHealthRecord> $puppyHealthRecords
 * @property-read int|null $puppy_health_records_count
 * @property-read \App\Models\Role $role
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Role> $roles
 * @property-read int|null $roles_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Article> $savedArticles
 * @property-read int|null $saved_articles_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\SavedItem> $savedItems
 * @property-read int|null $saved_items_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Setting> $settings
 * @property-read int|null $settings_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\StudService> $studServices
 * @property-read int|null $stud_services_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \Laravel\Cashier\Subscription> $subscriptions
 * @property-read int|null $subscriptions_count
 * @property-read \App\Models\TrainerProfile|null $trainerProfile
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Vaccination> $vaccinations
 * @property-read int|null $vaccinations_count
 * @property-read \App\Models\VetProfile|null $vetProfile
 * @property-read \App\Models\WelfareProfile|null $welfareProfile
 * @method static \Database\Factories\UserFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User hasExpiredGenericTrial()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User onGenericTrial()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereAvatar($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereCityId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereEmailVerifiedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereKarmaPoints($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereLatitude($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereLongitude($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereMobileNumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User wherePassword($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User wherePmLastFour($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User wherePmType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereRememberToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereRoleId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereStateId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereStripeId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereSuspendedUntil($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereTrialEndsAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereUpdatedAt($value)
 */
	class User extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $user_id
 * @property string $action
 * @property string $method
 * @property string $url
 * @property array<array-key, mixed>|null $payload
 * @property string|null $ip_address
 * @property string|null $user_agent
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserAuditLog newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserAuditLog newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserAuditLog query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserAuditLog whereAction($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserAuditLog whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserAuditLog whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserAuditLog whereIpAddress($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserAuditLog whereMethod($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserAuditLog wherePayload($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserAuditLog whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserAuditLog whereUrl($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserAuditLog whereUserAgent($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserAuditLog whereUserId($value)
 */
	class UserAuditLog extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $user_id
 * @property int $badge_id
 * @property \Illuminate\Support\Carbon|null $earned_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Badge $badge
 * @property-read \App\Models\User $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserBadge newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserBadge newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserBadge query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserBadge whereBadgeId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserBadge whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserBadge whereEarnedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserBadge whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserBadge whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserBadge whereUserId($value)
 */
	class UserBadge extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $pet_id
 * @property int|null $vet_id
 * @property string $vaccine_name
 * @property \Illuminate\Support\Carbon $vaccination_date
 * @property \Illuminate\Support\Carbon|null $next_due_date
 * @property string|null $reminder_sent_at
 * @property string|null $vet_name
 * @property string|null $notes
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Pet $pet
 * @property-read \App\Models\VetProfile|null $vet
 * @method static \Database\Factories\VaccinationFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Vaccination newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Vaccination newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Vaccination query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Vaccination whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Vaccination whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Vaccination whereNextDueDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Vaccination whereNotes($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Vaccination wherePetId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Vaccination whereReminderSentAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Vaccination whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Vaccination whereVaccinationDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Vaccination whereVaccineName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Vaccination whereVetId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Vaccination whereVetName($value)
 */
	class Vaccination extends \Eloquent {}
}

namespace App\Models{
/**
 * @property-read mixed $image_url
 * @property-read \App\Models\VetProfile|null $vetProfile
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VetGallery newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VetGallery newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VetGallery query()
 */
	class VetGallery extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int|null $user_id
 * @property string $type
 * @property string $name
 * @property string $slug
 * @property string|null $description
 * @property string $phone
 * @property string|null $email
 * @property string|null $website
 * @property int|null $experience_years
 * @property string|null $service_type
 * @property numeric|null $price_per_day
 * @property int|null $capacity
 * @property int $state_id
 * @property int $city_id
 * @property string $address
 * @property string|null $logo
 * @property string|null $facebook_url
 * @property string|null $instagram_url
 * @property string|null $twitter_url
 * @property string|null $youtube_url
 * @property int $is_verified
 * @property int $is_active
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property int|null $agent_id
 * @property string|null $claimed_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\AdPlacement> $adPlacements
 * @property-read int|null $ad_placements_count
 * @property-read \App\Models\Admin|null $agent
 * @property-read \App\Models\City $city
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\VetGallery> $gallery
 * @property-read int|null $gallery_count
 * @property mixed $clinic_name
 * @property-read mixed $logo_url
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Review> $reviews
 * @property-read int|null $reviews_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\VetService> $services
 * @property-read int|null $services_count
 * @property-read \App\Models\State $state
 * @property-read \App\Models\User|null $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VetProfile newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VetProfile newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VetProfile query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VetProfile whereAddress($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VetProfile whereAgentId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VetProfile whereCapacity($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VetProfile whereCityId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VetProfile whereClaimedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VetProfile whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VetProfile whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VetProfile whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VetProfile whereExperienceYears($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VetProfile whereFacebookUrl($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VetProfile whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VetProfile whereInstagramUrl($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VetProfile whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VetProfile whereIsVerified($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VetProfile whereLogo($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VetProfile whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VetProfile wherePhone($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VetProfile wherePricePerDay($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VetProfile whereServiceType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VetProfile whereSlug($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VetProfile whereStateId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VetProfile whereTwitterUrl($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VetProfile whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VetProfile whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VetProfile whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VetProfile whereWebsite($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VetProfile whereYoutubeUrl($value)
 */
	class VetProfile extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $name
 * @property string $slug
 * @property string|null $description
 * @property int $is_active
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\VetProfile> $vetProfiles
 * @property-read int|null $vet_profiles_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VetService newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VetService newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VetService query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VetService whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VetService whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VetService whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VetService whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VetService whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VetService whereSlug($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VetService whereUpdatedAt($value)
 */
	class VetService extends \Eloquent {}
}

namespace App\Models{
/**
 * @property-read \App\Models\WelfareProfile|null $welfareProfile
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WelfareGallery newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WelfareGallery newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WelfareGallery query()
 */
	class WelfareGallery extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int|null $user_id
 * @property string $type
 * @property string $name
 * @property string $slug
 * @property string|null $description
 * @property string $phone
 * @property string|null $email
 * @property string|null $website
 * @property int|null $experience_years
 * @property string|null $service_type
 * @property numeric|null $price_per_day
 * @property int|null $capacity
 * @property int $state_id
 * @property int $city_id
 * @property string $address
 * @property string|null $logo
 * @property string|null $facebook_url
 * @property string|null $instagram_url
 * @property string|null $twitter_url
 * @property string|null $youtube_url
 * @property int $is_verified
 * @property int $is_active
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property int|null $agent_id
 * @property string|null $claimed_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\AdPlacement> $adPlacements
 * @property-read int|null $ad_placements_count
 * @property-read \App\Models\Admin|null $agent
 * @property-read \App\Models\City $city
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\WelfareGallery> $gallery
 * @property-read int|null $gallery_count
 * @property-read mixed $logo_url
 * @property mixed $organization_name
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Review> $reviews
 * @property-read int|null $reviews_count
 * @property-read \App\Models\State $state
 * @property-read \App\Models\User|null $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WelfareProfile newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WelfareProfile newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WelfareProfile query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WelfareProfile whereAddress($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WelfareProfile whereAgentId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WelfareProfile whereCapacity($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WelfareProfile whereCityId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WelfareProfile whereClaimedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WelfareProfile whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WelfareProfile whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WelfareProfile whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WelfareProfile whereExperienceYears($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WelfareProfile whereFacebookUrl($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WelfareProfile whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WelfareProfile whereInstagramUrl($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WelfareProfile whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WelfareProfile whereIsVerified($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WelfareProfile whereLogo($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WelfareProfile whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WelfareProfile wherePhone($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WelfareProfile wherePricePerDay($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WelfareProfile whereServiceType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WelfareProfile whereSlug($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WelfareProfile whereStateId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WelfareProfile whereTwitterUrl($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WelfareProfile whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WelfareProfile whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WelfareProfile whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WelfareProfile whereWebsite($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|WelfareProfile whereYoutubeUrl($value)
 */
	class WelfareProfile extends \Eloquent {}
}

